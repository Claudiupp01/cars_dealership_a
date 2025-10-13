import sys
sys.path.append('D:/cars_dealership_a/backend')
import auth

# Generate hash for "admin123"
hash = auth.get_password_hash("admin123")
print(hash)
exit()