from flask import Flask, request, jsonify
import time
from blockchain import Blockchain, initialize_keys, sign_credential, verify_signature
import json

#region Utility Functions

def load_users(filename="users.json"):
    """ Loads the users.json file
    TODO: This should be handled by flask route
     """
    with open(filename, "r") as f:
        return json.load(f)


def save_users(users, filename="users.json"):
    """ Writes a new entry to the users.json file """
    with open(filename, "w") as f:
        json.dump(users, f, indent=4)

#endregion

#region Flask Code

app = Flask(__name__)
blockchain = Blockchain()
users_registry = load_users()
initialize_keys(users_registry)

@app.route("/issue", methods=["POST"])
def issue_credential():
    data = request.get_json()
    issuer = data["issuer"]
    recipient = data["recipient"]
    degree = data["degree"]
    date_issued = data.get("date_issued", time.strftime("%Y-%m-%d"))

    # Load issuer private key
    with open(f"{issuer}_private.pem", "r") as f:
        private_key = f.read()

    credential_data = {
        "issuer": issuer,
        "recipient": recipient,
        "degree": degree,
        "date_issued": date_issued
    }
    signed_credential = sign_credential(private_key, credential_data)
    new_block = blockchain.add_block(signed_credential)
    return jsonify({"message": "Credential issued", "block_index": new_block.index})

@app.route("/verify/<recipient_name>", methods=["GET"])
def verify_recipient(recipient_name):
    result = []
    for block in blockchain.chain[1:]:  # skip Genesis block
        if block.credential_data["recipient"] == recipient_name:
            valid = verify_signature(
                users_registry[block.credential_data["issuer"]]["public_key"],
                block.credential_data
            )
            result.append({
                "block_index": block.index,
                "credential": block.credential_data,
                "valid": valid
            })
    return jsonify(result)

@app.route("/chain", methods=["GET"])
def get_chain():
    chain_data = []
    for block in blockchain.chain:
        chain_data.append({
            "index": block.index,
            "timestamp": block.timestamp,
            "credential_data": block.credential_data,
            "previous_hash": block.previous_hash,
            "hash": block.hash
        })
    return jsonify(chain_data)

#endregion

if __name__ == "__main__":
    app.run(port=5000, debug=True)