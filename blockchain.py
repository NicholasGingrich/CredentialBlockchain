# Code to store blockchain classes

import hashlib
import json
import time
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from flask_server import save_users

class Block:
    def __init__(self, index, timestamp, credential_data, previous_hash, nonce=0):
        self.index = index
        self.timestamp = timestamp
        self.data = credential_data           
        self.previous_hash = previous_hash
        self.nonce = nonce
        self.hash = self.compute_hash()

    def compute_hash(self):
        """ Create a SHA-256 hash of the block and return it """

        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "credential_data": self.credential_data,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True).encode()

        return hashlib.sha256(block_string).hexdigest()


class Blockchain:
    difficulty = 2 

    def __init__(self, user_registry):
        self.chain = []
        self.create_genesis_block()
        self.user_registry = user_registry

    def create_genesis_block(self):
        """ Creates the genesis block and adds it to the blockchain """

        genesis_block = Block(0, time.time(), "Genesis Block", "0")
        self.chain.append(genesis_block)

    def get_last_block(self):
        return self.chain[-1]

    def proof_of_work(self, block):
        """ Sample proof of work simulation. Find the a nonce that starts with Blockchain.difficulty 0's """

        while not block.hash.startswith("0" * Blockchain.difficulty):
            block.nonce += 1
            block.hash = block.compute_hash()

        return block.hash

    def add_block(self, credential_data):
        """ Add a new block to the chain """

        previous_block = self.get_last_block()
        new_block = Block(
            index=previous_block.index + 1,
            timestamp=time.time(),
            credential_data=credential_data,
            previous_hash=previous_block.hash
        )

        self.proof_of_work(new_block)
        self.chain.append(new_block)

    def is_chain_valid(self):
        """ Verify each block in the chain is valid """
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]

            # Check if stored hash matches computed hash
            if current.hash != current.compute_hash():
                print("Invalid hash at block", i)
                return False

            # Check if stored previous hash matches actual previous hash
            if current.previous_hash != previous.hash:
                print("Invalid previous hash link at block", i)
                return False

            # Verify credential signature
            credential = current.credential_data
            if credential != "Genesis Block":
                issuer_name = credential["issuer"]
                public_key = self.users_registry[issuer_name]["public_key"]
                if not verify_signature(public_key, credential):
                    print(f"Invalid signature at block {i}")
                    return False

        return True

def generate_rsa_key_pair():
    """ Generates an RSA encryption key pair """
    key = RSA.generate(2048)
    private_key = key.export_key().decode()
    public_key = key.publickey().export_key().decode()
    return private_key, public_key

def sign_credential(private_key_pem, credential_data):
    """ Createst digital signature for crednetial data and returns data and signature """
    key = RSA.import_key(private_key_pem)
    data_string = json.dumps({k: credential_data[k] for k in credential_data}, sort_keys=True).encode()
    h = SHA256.new(data_string)
    signature = pkcs1_15.new(key).sign(h)
    credential_data_signed = credential_data.copy()
    credential_data_signed["signature"] = signature.hex()
    return credential_data_signed

def verify_signature(public_key_pem, credential_data):
    """ Verifies that signature is valid credential data """
    signature = credential_data["signature"]
    data_dict = {k: credential_data[k] for k in credential_data if k != "signature"}
    data_string = json.dumps(data_dict, sort_keys=True).encode()
    h = SHA256.new(data_string)
    key = RSA.import_key(public_key_pem)
    try:
        pkcs1_15.new(key).verify(h, bytes.fromhex(signature))
        return True
    except (ValueError, TypeError):
        return False

def initialize_keys(users):
    """" Initialized keys for each user in json file.
    TODO: This assumes all users have used the system previously. Need to make it so first time users can register
     """
    for issuer in users:
        if users[issuer]["public_key"] == "":
            private_key, public_key = generate_rsa_key_pair()
            users[issuer]["public_key"] = public_key
            # Store private key locally for issuing credentials
            with open(f"{issuer}_private.pem", "w") as f:
                f.write(private_key)
    save_users(users)