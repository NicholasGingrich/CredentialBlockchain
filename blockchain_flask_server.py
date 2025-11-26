from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import json
from blockchain import Blockchain, initialize_keys, sign_credential, verify_signature, load_users

app = Flask(__name__)

CORS(app, origins="*")

blockchain = Blockchain()
initialize_keys()

@app.route("/issue", methods=["POST"])
def issue_credential():
    data = request.get_json()
    issuer = data["issuer"]
    recipient = data["recipient"]
    credential_type = data["credential_type"]
    date_issued = data.get("date_issued", time.strftime("%Y-%m-%d"))

    with open(f"./data/PEM/{issuer.replace(' ', '_')}_private.pem", "r") as f:
        private_key = f.read()

    credential_data = {
        "issuer": issuer,
        "recipient": recipient,
        "credential_type": credential_type,
        "date_issued": date_issued
    }

    signed_credential = sign_credential(private_key, credential_data)
    new_block = blockchain.add_block(signed_credential)
    return jsonify({"message": "Credential issued", "block_index": new_block.index})

@app.route("/verify/<recipient_name>", methods=["GET"])
def verify_recipient(recipient_name):
    requested_type = request.args.get("type")
    requested_issuer = request.args.get("issuer")
    if not requested_type:
        return jsonify({"error": "Missing 'type' query parameter"}), 400
    
    if not requested_issuer:
        return jsonify({"error": "Missing 'issuer' query parameter"}), 400

    for block in blockchain.chain[1:]:
        credential = block.data
        issuer = credential.get("issuer")

        if credential.get("recipient") != recipient_name or credential.get("credential_type") != requested_type or issuer != requested_issuer:
            continue

        users_registry = load_users()
        issuer_obj = next((user for user in users_registry["users"] if user["name"] == issuer), None)

        valid = False
        if issuer_obj:
            public_key = issuer_obj["public_key"]
            print("Public Key:")
            print(public_key)
            valid = verify_signature(public_key, credential)

        return jsonify({
            "block_index": block.index,
            "credential": credential,
            "valid": valid
        }), 200

    return jsonify({"block_index": None, "credential": None, "valid": False}), 200


@app.route("/chain", methods=["GET"])
def get_chain():
    chain_data = []
    for block in blockchain.chain:
        chain_data.append({
            "index": block.index,
            "timestamp": block.timestamp,
            "credential_data": block.data,
            "previous_hash": block.previous_hash,
            "hash": block.hash
        })
    return jsonify(chain_data)


if __name__ == "__main__":
    app.run(port=5000, debug=True)