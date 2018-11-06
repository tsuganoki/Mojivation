from passlib.hash import scrypt
from os import urandom


# Calculating a hash

def get_hash(pw):
	hash_str = scrypt.using(rounds=8).hash(pw)

	return hash_str

# Validating a hash
def val_hash(pw,hash_str):
	if scrypt.verify(pw, hash_str):

	    return True
	else:
		return False


def get_salt():
	NUM = 512
	return urandom(NUM)



# app.config['SECRET_KEY']
def get_salted_hash(pw, user_id, secret_key):
	
	return get_hash(pw + user_id + secret_key)



	hashes.get_salted_hash()