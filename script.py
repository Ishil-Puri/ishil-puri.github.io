#import cgitb; cgitb.enable()
import requests

app_ID = 834259900392053
long_lived_token = "IGQVJWMk10UmIydHNYa0ttUm84WThHYXNfbm5BWVZAGeEFPQ3N6REFxYVNmR3NJRW9WS3o5LVUtRnNncXFTaTVxUWQzdkZAMbzlkSmNZARUkzYXZAWM2VzTUFMYjJtTDR0c3RYWGFRVV93"

def getID():
    URL = "https://graph.instagram.com/me?fields=id,username"
    params = {"access_token" : long_lived_token}
    response = requests.get(URL, params)
    result = response.json()
    user_id = result["id"]
    username = result["username"]
    return user_id, username

def getMedia(): 
    URL = "https://graph.instagram.com/me/media?"
    params = {"fields":"id,media_type,media_url,timestamp", "access_token" : long_lived_token}
    response = requests.get(URL, params)
    result = response.json()
    return result

user_id, username = getID()

def selectMedia(field):
    result = getMedia()
    for d in result["data"]:
        print(d[field])
