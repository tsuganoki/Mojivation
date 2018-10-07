from passlib.hash import scrypt


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