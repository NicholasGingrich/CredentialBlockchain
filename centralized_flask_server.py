from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import json
from blockchain import Blockchain, initialize_keys, sign_credential, verify_signature, load_users
import pymysql

app = Flask(__name__)

CORS(app, origins="*")

blockchain = Blockchain()

def get_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="b0st0nuniv2023",
        database="final_project_db",
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route("/issue", methods=["POST"])
def issue_credential():
    data = request.get_json()
    issuer = data.get("issuer")
    recipient = data.get("recipient")
    credential_type = data.get("credential_type")
    date_issued = data.get("date_issued", time.strftime("%Y-%m-%d"))

    try:
        conn = get_connection()
        cur = conn.cursor()

        sql = """
        INSERT INTO credentials (issuer, recipient, credential_type, date_issued)
        VALUES (%s, %s, %s, %s)
        """
        cur.execute(sql, (issuer, recipient, credential_type, date_issued))
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"success": True})

    except Exception as e:
        print("Error issuing credential:", e)
        return jsonify({"success": False})



@app.route("/verify", methods=["POST"])
def verify_credential():
    data = request.get_json()
    issuer = data["issuer"]
    credential_type = data["credentialType"]
    recipient_name = data["recipientName"]

    conn = get_connection()
    cur = conn.cursor()

    sql = "SELECT * FROM credentials WHERE issuer=%s AND recipient=%s AND credential_type=%s LIMIT 1"
    cur.execute(sql, (issuer, recipient_name, credential_type))
    user = cur.fetchone()

    cur.close()
    conn.close()

    if user:
        return {"success": True}
    else:
        return {"success": False, "message": "Invalid username or password"}



@app.route("/register_user", methods=["POST"])
def register_user():
    data = request.get_json()
    username = data["username"]
    password_hash = data["password"]

    conn = get_connection()
    cur = conn.cursor()

    sql = "INSERT INTO users (username, password_hash) VALUES (%s, %s)"
    cur.execute(sql, (username, password_hash))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"success": True})

@app.route("/verify_user", methods=["POST"])
def verify_user():
    data = request.get_json()
    username = data["username"]
    password_hash = data["password"]

    conn = get_connection()
    cur = conn.cursor()

    sql = "SELECT * FROM users WHERE username=%s AND password_hash=%s LIMIT 1"
    cur.execute(sql, (username, password_hash))
    user = cur.fetchone()

    cur.close()
    conn.close()

    if user:
        return {"success": True}
    else:
        return {"success": False, "message": "Invalid username or password"}

if __name__ == "__main__":
    app.run(port=5000, debug=True)