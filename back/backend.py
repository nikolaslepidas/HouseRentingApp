from flask import Flask
from flask import request
from flask_mysqldb import MySQL
from flask import jsonify
from flask_cors import CORS
from flask import send_from_directory
import os
import glob
import json
import xmltodict
from bonus import MatrixFactorization
import numpy as np

app = Flask(__name__)

CORS(app) # Cross-origin resource sharing mechanism
app.config['MYSQL_HOST']      = 'localhost'
app.config['MYSQL_USER']      = 'root'
app.config['MYSQL_PASSWORD']  = 'toor'
app.config['MYSQL_DB']        = 'airbnb'
#app.config['MYSQL_PORT'] = '3306' DEFAULT

mysql = MySQL(app)

@app.route('/login', methods=['POST'])
def login():
  data = request.json
  cur = mysql.connection.cursor()

  sql = "Select * from user where username = %s and password = %s"
  val = (data['username'], data['password'])
  cur.execute(sql, val) 
  db_data = cur.fetchone()

  if (db_data == None):
    response = jsonify({'success': 'false'})
    return response
  else:
    response = jsonify({'success': 'true', 'id': db_data[0], 'name': db_data[1],
     'surname': db_data[2], 'email': db_data[3], 'phone': db_data[4],
     'role': db_data[5], 'username': db_data[6], 'admin': db_data[8],
     'profile_img': db_data[9], 'accepted': db_data[10]})
    return response

@app.route('/register', methods=['POST'])
def register():
  data = request.json
  print(data)
  cur = mysql.connection.cursor()
  
  sql = "Select username from user where username = %s"
  val = (data['username'],)  # I should give a tuple thus the comma
  cur.execute(sql, val)
  db_data = cur.fetchone()

  if (db_data == None):
    sql = "Insert into user (name, surname, email, phone, role, username, password, accepted, admin) values (%s, %s, %s, %s, %s, %s, %s, %s, 0)"
    val = (data['name'], data['surname'], data['email'], data['phone'], data['role'], data['username'], data['password'], data['accepted'])
    cur.execute(sql, val)

    mysql.connection.commit()  # attention we should also commit the changes to the db

    response = jsonify({'success': 'true'})
    return response
  else:
    response = jsonify({'success': 'false'})
    return response

@app.route('/get_users', methods=['GET'])
def get_users():
  cur = mysql.connection.cursor()

  sql = "Select * from user"
  cur.execute(sql)
  db_data = cur.fetchall()

  myList = []
  for user in db_data:
    myList.append({'success': 'true', 'id': user[0], 'name': user[1],
     'surname': user[2], 'email': user[3], 'phone': user[4],
     'role': user[5], 'username': user[6], 'admin': user[8],
     'profile_img': user[9], 'accepted': user[10]})
  return jsonify(myList)

@app.route('/profile_img/<filename>') # id.format stored in db
def send_profile_img(filename):
  return send_from_directory('./images/profile_img/', filename)

@app.route('/apartment_img/<path:path>') # path is like id/filename
def send_apartment_img(path):
  array = path.split("/")
  return send_from_directory('./images/apartments/' + array[0] + '/', array[1])

@app.route('/update/user', methods=['POST'])
def update_user():
  data = request.json
  cur = mysql.connection.cursor()
  sql = "update user set name = %s, surname = %s, email = %s, phone = %s where id = %s"
  val = (data['name'], data['surname'], data['email'], data['phone'], data['id'])
  cur.execute(sql, val)
  mysql.connection.commit()
  response = jsonify({'success': 'true'})
  return response

@app.route('/update/password', methods=['POST'])
def update_password():
  data = request.json
  cur = mysql.connection.cursor()
  sql = "update user set password = %s where id = %s"
  val = (data['newPassword'], data['id'])
  cur.execute(sql, val)
  mysql.connection.commit()
  response = jsonify({'success': 'true'})
  return response

@app.route('/search', methods=['POST'])
def search():
  data = request.json
  cur = mysql.connection.cursor()
  sql = """Select * from apartment where start <= %s and end >= %s and 
  (city = %s or region = %s) and guests >= %s and minDays <= %s and user_id != %s
  and not exists (select * from reservation where (start <= %s and %s <= end) or (start <= %s and %s <= end))"""
  val = (data['start'], data['end'], data['location'], data['location'],
  data['guests'], data['numDays'], data['id'], data['start'], data['start'], data['end'], data['end'])
  cur.execute(sql, val)
  db_data = cur.fetchall()

  myList = []
  for temp_tuple in db_data:
    myList.append({"id":temp_tuple[0], "name": temp_tuple[1], "image": temp_tuple[2], "latitude": temp_tuple[3],
    "longitude": temp_tuple[4], "city": temp_tuple[5], "region": temp_tuple[6], "address": temp_tuple[7],
    "bedrooms": temp_tuple[8], "beds": temp_tuple[9], "bathrooms": temp_tuple[10], "kitchens": temp_tuple[11],
    "smoking": temp_tuple[12], "pet": temp_tuple[13], "tv": temp_tuple[14], "wifi": temp_tuple[15], "airCondition": temp_tuple[16],
    "elevator": temp_tuple[17], "parking": temp_tuple[18], "start": temp_tuple[19], "end": temp_tuple[20], "rating": temp_tuple[22],
    "reviews": temp_tuple[23], "costPerNight": temp_tuple[24], "type": temp_tuple[25], "description": temp_tuple[27], "host": temp_tuple[28]})
    print(temp_tuple)
  return jsonify(myList)

@app.route('/advanced_search', methods=['POST'])
def advanced_search():
  # Creating RATING MATRIX --> R
  cur = mysql.connection.cursor()
  cur.execute("select id from user")
  user_ids = cur.fetchall()

  cur.execute("select user_id, apartment_id, rating from reservation")
  reservations = cur.fetchall()

  cur.execute("select count(id) from apartment")
  num_apartments = cur.fetchone()

  R = np.zeros((len(user_ids), num_apartments[0]))
  for reservation in reservations:
    R[reservation[0]-1][reservation[1]-1] = reservation[2]
  
  # Use of Matrix Factorization technic to predict unrated apartments
  mf = MatrixFactorization(R, K=2, h=0.001)
  mf.train()
  predicted = mf.predicted_matrix()
  #np.set_printoptions(precision=2)
  data = request.json
  id = int(data['id'])
  predictions = []
  for j in range(num_apartments[0]):
    for reservation in reservations:
      if reservation[0] == data['id'] and reservation[1] == j+1:
        break
      else:
        predictions.append((j+1, predicted[id-1, j]))
        break

  predictions.sort(key = lambda x: x[1], reverse = True)
  #print(predictions)
  sql = """Select * from apartment where start <= %s and end >= %s and 
  (city = %s or region = %s) and guests >= %s and minDays <= %s and user_id != %s
  and not exists (select * from reservation where (start <= %s and %s <= end) or (start <= %s and %s <= end))"""
  val = (data['start'], data['end'], data['location'], data['location'],
  data['guests'], data['numDays'], data['id'], data['start'], data['start'], data['end'], data['end'])
  cur.execute(sql, val)
  db_data = cur.fetchall()
  #print(predictions)
  #for data in db_data:
  #  print(data[0])
  
  myList = []
  for prediction in predictions:
    for temp_tuple in db_data:
      if prediction[0] == temp_tuple[0]:
        myList.append({"id":temp_tuple[0], "name": temp_tuple[1], "image": temp_tuple[2], "latitude": temp_tuple[3],
        "longitude": temp_tuple[4], "city": temp_tuple[5], "region": temp_tuple[6], "address": temp_tuple[7],
        "bedrooms": temp_tuple[8], "beds": temp_tuple[9], "bathrooms": temp_tuple[10], "kitchens": temp_tuple[11],
        "smoking": temp_tuple[12], "pet": temp_tuple[13], "tv": temp_tuple[14], "wifi": temp_tuple[15], "airCondition": temp_tuple[16],
        "elevator": temp_tuple[17], "parking": temp_tuple[18], "start": temp_tuple[19], "end": temp_tuple[20], "rating": temp_tuple[22],
        "reviews": temp_tuple[23], "costPerNight": temp_tuple[24], "type": temp_tuple[25], "description": temp_tuple[27], "host": temp_tuple[28]})
        break

  #print(myList)
  return jsonify(myList)

@app.route('/apartment_imgs/<int:id>', methods=['GET'])
def apartment_images(id):
  cur = mysql.connection.cursor()
  sql = "Select * from image where apartment_id = %s"
  val = (id, )
  cur.execute(sql, val)
  db_data = cur.fetchall()

  myList = []
  for image in db_data:
    myList.append(image)
  return jsonify(myList)

@app.route('/book', methods=['POST'])
def book():
  data = request.json
  cur = mysql.connection.cursor()
  sql = """insert into reservation (start, end, guests, cost, user_id, apartment_id, apartment_user_id)
  values (%s, %s, %s, %s, %s, %s, %s)"""
  val = (data['start'], data['end'], data['guests'], data['cost'], data['user_id'], data['apartment_id'], data['apartment_user_id'])
  cur.execute(sql, val)
  mysql.connection.commit()
  return jsonify({"success": "true"})

@app.route('/apartment/get_reviews', methods=['POST'])
def apartment_get_reviews():
  data = request.json
  cur = mysql.connection.cursor()
  sql = "select rating,review from reservation where apartment_id = %s"
  val = (data['apartment_id'], )
  cur.execute(sql, val)
  db_data = cur.fetchall()
  myList = []
  for result in db_data:
    myList.append({'rating': result[0], 'review': result[1]})
  return jsonify(myList)

@app.route('/get_apartments', methods=['POST'])
def get_apartments():
  data = request.json
  cur = mysql.connection.cursor()
  sql = "Select * from apartment where user_id = %s"
  val = (data['user_id'], )
  cur.execute(sql, val)
  db_data = cur.fetchall()

  myList = []
  for temp_tuple in db_data:
    myList.append({"id":temp_tuple[0], "name": temp_tuple[1], "image": temp_tuple[2], "latitude": temp_tuple[3],
    "longitude": temp_tuple[4], "city": temp_tuple[5], "region": temp_tuple[6], "address": temp_tuple[7],
    "bedrooms": temp_tuple[8], "beds": temp_tuple[9], "bathrooms": temp_tuple[10], "kitchens": temp_tuple[11],
    "smoking": temp_tuple[12], "pet": temp_tuple[13], "tv": temp_tuple[14], "wifi": temp_tuple[15], "airCondition": temp_tuple[16],
    "elevator": temp_tuple[17], "parking": temp_tuple[18], "start": temp_tuple[19], "end": temp_tuple[20], "minDays": temp_tuple[21], 
    "rating": temp_tuple[22], "reviews": temp_tuple[23], "costPerNight": temp_tuple[24], "type": temp_tuple[25], "guests": temp_tuple[26],
    "description": temp_tuple[27], "host": temp_tuple[28]})
    print(temp_tuple)
  return jsonify(myList)

@app.route('/get_host', methods=['POST'])
def get_host():
  data = request.json
  cur = mysql.connection.cursor()

  sql = "Select * from user where id = %s and (role = 1 or role = 2)"
  val = (data['user_id'], )
  cur.execute(sql, val) 
  db_data = cur.fetchone()

  if (db_data == None):
    response = jsonify({'success': 'false'})
    return response
  else:
    response = jsonify({'success': 'true', 'name': db_data[1],
     'surname': db_data[2], 'profile_img': db_data[9], 'numReviews': 3})
    return response

@app.route('/add_apartment', methods=['POST'])
def add_apartment():
  data = request.json
  cur = mysql.connection.cursor()
  sql = """insert into apartment (name, latitude, longitude, city, region, address, bedrooms, beds, bathrooms, kitchens, smoking, pets, tv, wifi, airCondition, elevator, parking, start, end, minDays, costPerNight, type, guests, description, user_id)
  values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
  val = (data['name'], data['latitude'], data['longitude'], data['city'], data['region'], data['address'],
  data['bedrooms'], data['beds'], data['bathrooms'], data['kitchens'], data['smoking'], data['pets'], data['tv'], 
  data['wifi'], data['airCondition'], data['elevator'], data['parking'], data['start'], data['end'], data['minDays'], 
  data['costPerNight'], data['type'], data['guests'], data['description'], data['user_id'])
  cur.execute(sql, val)
  mysql.connection.commit()

  cur.execute("select id from apartment order by id desc")
  db_data = cur.fetchone()

  return jsonify({"success": "true", "id": db_data[0]})

@app.route('/update_apartment', methods=['POST'])
def update_apartment():
  data = request.json
  cur = mysql.connection.cursor()
  sql = """update apartment set name = %s, bedrooms = %s, beds = %s, bathrooms = %s, 
  kitchens = %s, smoking = %s, pets = %s, tv = %s, wifi = %s, airCondition = %s, elevator = %s,
  parking = %s, start = %s, end = %s, minDays = %s, costPerNight = %s, type = %s, guests = %s,
  description = %s where id = %s"""
  val = (data['name'], data['bedrooms'], data['beds'], data['bathrooms'], data['kitchens'], data['smoking'], 
  data['pets'], data['tv'], data['wifi'], data['airCondition'], data['elevator'], data['parking'], data['start'], 
  data['end'], data['minDays'], data['costPerNight'], data['type'], data['guests'], data['description'], data['id'])
  cur.execute(sql, val)
  mysql.connection.commit()
  response = jsonify({'success': 'true'})
  return response

@app.route('/getXML')
def getXML():
  os.system("mysqldump -u root -ptoor --xml airbnb > airbnb.xml")
  return send_from_directory('./', 'airbnb.xml', as_attachment=True)

@app.route('/getJSON')
def getJSON():
  os.system("mysqldump -u root -ptoor --xml airbnb > airbnb.xml")
  with open("airbnb.xml") as xml_file:
    data_dict = xmltodict.parse(xml_file.read()) 
    xml_file.close() 
    # generate the object using json.dumps()  
    # corresponding to json data 
    json_data = json.dumps(data_dict) 
    # Write the json data to output  
    # json file 
    with open("airbnb.json", "w") as json_file: 
        json_file.write(json_data) 
        json_file.close() 
  return send_from_directory('./', 'airbnb.json', as_attachment=True)

@app.route('/accept_host', methods=['POST'])
def accept_host():
  data = request.json
  cur = mysql.connection.cursor()
  sql = "update user set accepted = %s where id = %s"
  val = (data['accepted'], data['id'])
  cur.execute(sql, val)
  mysql.connection.commit()
  response = jsonify({'success': 'true'})
  return response

@app.route('/add_message', methods=['POST'])
def add_message():
  data = request.json
  cur = mysql.connection.cursor()
  sql = """insert into message (user_id, receiver, body) values (%s, %s, %s)"""
  val = (data['sender_id'], data['receiver_id'], data['message'])
  cur.execute(sql, val)
  mysql.connection.commit()
  response = jsonify({'success': 'true'})
  return response

@app.route('/get_messages', methods=['POST'])
def get_messages():
  data = request.json
  cur = mysql.connection.cursor()
  sql = "select * from message where (user_id = %s and receiver = %s) or (user_id = %s and receiver = %s) order by id"
  val = (data['sender_id'], data['receiver_id'], data['receiver_id'], data['sender_id'])
  cur.execute(sql, val)
  db_data = cur.fetchall()
  myList = []
  for message in db_data:
    myList.append({"sender_id": message[3], "receiver_id": message[2], "message": message[1]})
  return jsonify(myList)

@app.route('/delete_messages', methods=['POST'])
def delete_messages():
  data = request.json
  cur = mysql.connection.cursor()
  sql = "delete from message where (user_id = %s and receiver = %s) or (user_id = %s and receiver = %s)"
  val = (data['sender_id'], data['receiver_id'], data['receiver_id'], data['sender_id'])
  cur.execute(sql, val)
  mysql.connection.commit()
  return jsonify({"success": "true"})

@app.route('/get_username', methods=['POST'])
def get_name():
  data = request.json
  cur = mysql.connection.cursor()
  sql = "select username from user where id = %s"
  val = (data['id'], )
  cur.execute(sql, val)
  db_data = cur.fetchone()
  return jsonify({"username": db_data[0]})

@app.route('/get_reservations', methods=['POST'])
def get_reservations():
  data = request.json
  cur = mysql.connection.cursor()
  sql = "select * from reservation where user_id = %s"
  val = (data['id'],)
  cur.execute(sql, val)
  db_data = cur.fetchall()
  myList = []
  for reservation in db_data:
    sql = "select name, image from apartment where id = %s"
    val = (reservation[8],)
    cur.execute(sql, val)
    name_image = cur.fetchone()
    myList.append({"id": reservation[0], "start": reservation[1], "end": reservation[2],
    "guests": reservation[3], "cost": reservation[4], "name": name_image[0], "image": name_image[1]})
  return jsonify(myList)

@app.route('/get_reservation', methods=['POST'])
def get_reservation():
  data = request.json
  cur = mysql.connection.cursor()
  sql = "select * from reservation where id = %s"
  val = (data['id'],)
  cur.execute(sql, val)
  reservation = cur.fetchone()
  
  sql = "select * from apartment where id = %s"
  val = (reservation[8],)
  cur.execute(sql, val)
  apartment = cur.fetchone()
  
  myList = []

  myList.append({"id": reservation[0], "start": reservation[1], "end": reservation[2], "guests": reservation[3], 
  "cost": reservation[4], "rating": reservation[5], "review": reservation[6], "user_id": reservation[7],
  "apartment_id": reservation[8], "apartment_user_id": reservation[9]})
  
  myList.append({"id":apartment[0], "name": apartment[1], "image": apartment[2], "latitude": apartment[3],
  "longitude": apartment[4], "city": apartment[5], "region": apartment[6], "address": apartment[7],
  "bedrooms": apartment[8], "beds": apartment[9], "bathrooms": apartment[10], "kitchens": apartment[11],
  "smoking": apartment[12], "pet": apartment[13], "tv": apartment[14], "wifi": apartment[15], "airCondition": apartment[16],
  "elevator": apartment[17], "parking": apartment[18], "start": apartment[19], "end": apartment[20], "rating": apartment[22],
  "reviews": apartment[23], "costPerNight": apartment[24], "type": apartment[25], "description": apartment[27], "host": apartment[28]})
  return jsonify(myList)

@app.route('/get_conversations', methods=['POST'])
def get_conversations():
  data = request.json
  cur = mysql.connection.cursor()
  sql = "select distinct user_id from message where receiver = %s"
  val = (data['id'], )
  cur.execute(sql, val)
  db_data = cur.fetchall()
  mySet = set()
  for id in db_data:
    mySet.add(id)
  
  sql = "select distinct receiver from message where user_id = %s"
  val = (data['id'], )
  cur.execute(sql, val)
  db_data = cur.fetchall()

  for id in db_data:
    mySet.add(id)

  print(mySet)
  myList = []
  for sender in mySet:
    sql = "select name, surname, profile_img from user where id = %s"
    val = (sender[0],)
    cur.execute(sql, val)
    result = cur.fetchone()
    myList.append({"id": sender[0], "name": result[0], "surname": result[1],
    "profile_img": result[2]})
  return jsonify(myList)

@app.route('/upload/profile_img', methods=['POST'])
def upload_profile_img():
  id = request.form['id']
  file = request.files['file']
  result = file.filename.split('.')
  filetype = result[1]
  
  old_file = "./images/profile_img/" + id + "*"
  for filename in glob.glob(old_file):
    os.remove(filename)
  
  file.filename = id + "." + filetype
  file.save(os.path.join("./images/profile_img", file.filename))
  
  cur = mysql.connection.cursor()
  sql = "update user set profile_img = %s where id = %s"
  val = (file.filename, id)
  cur.execute(sql, val)
  mysql.connection.commit()
  response = jsonify({'success': 'true'})
  return response

@app.route('/upload/apartment_img', methods=['POST'])
def upload_apartment_img():
  id = request.form['id']
  host = request.form['host']
  file = request.files['file']
  result = file.filename.split('.')
  filetype = result[1]
  
  folder = "./images/apartments/" + id
  if not os.path.exists(folder):
    os.makedirs(folder)
  
  old_file = "./images/apartments/" + id + "/" + id + ".*"
  for filename in glob.glob(old_file):
    os.remove(filename)
  
  file.filename = id + "." + filetype
  file.save(os.path.join(folder, file.filename))
  
  cur = mysql.connection.cursor()
  sql = "update apartment set image = %s where id = %s"
  val = (file.filename, id)
  cur.execute(sql, val)
  mysql.connection.commit()

  sql = "insert into image (filename, apartment_id, apartment_user_id) values (%s, %s, %s)"
  val = (file.filename, id, host)
  cur.execute(sql, val)
  mysql.connection.commit()
  response = jsonify({'success': 'true'})
  return response

@app.route('/upload/apartment_imgs', methods=['POST'])
def upload_apartment_imgs():
  id = request.form['id']
  host = request.form['host']
  files = request.files.getlist('file')
  cur = mysql.connection.cursor()
  for file in files:
    folder = "./images/apartments/" + id + "/"
    file.save(os.path.join(folder, file.filename))
    
    sql = "insert into image (filename, apartment_id, apartment_user_id) values (%s, %s, %s)"
    val = (file.filename, id, host)
    cur.execute(sql, val)
    mysql.connection.commit()
  response = jsonify({'success': 'true'})
  return response

@app.route('/delete/apartment_imgs', methods=['POST'])
def delete_apartment_imgs():
  data = request.json
  cur = mysql.connection.cursor()
  for file in data['files']:
    sql = "delete from image where filename = %s and apartment_id = %s and apartment_user_id = %s"
    val = (file['file'], data['id'], data['host'])
    cur.execute(sql, val)
    mysql.connection.commit()
    img = "./images/apartments/" + data['id'] + "/" + file['file']
    os.remove(img)
  response = jsonify({'success': 'true'})
  return response

##########################################################################################
#dummy endpoints below
@app.route('/upload/demo', methods=['POST'])
def upload_demo():
  print(request.files)
  files = request.files.getlist('file')
  print(files)
  for file in files:
    print(file.filename)
  return "ok"

@app.route('/update/apartment_img', methods=['POST'])
def update_apartment_img():
  id = request.form['id']
  host = request.form['host']
  old_filename = request.form['olf_filename']
  file = request.files['file']
  result = file.filename.split('.')
  filetype = result[1]
  
  folder = "./images/apartments/" + id
  if not os.path.exists(folder):
    os.makedirs(folder)
  
  old_file = "./images/apartments/" + id + "/" + id + ".*"
  for filename in glob.glob(old_file):
    os.remove(filename)
  
  file.filename = id + "." + filetype
  file.save(os.path.join(folder, file.filename))
  
  cur = mysql.connection.cursor()
  sql = "update apartment set image = %s where id = %s"
  val = (file.filename, id)
  cur.execute(sql, val)
  mysql.connection.commit()

  sql = "update image set filename = %s where filename = %s and apartment_id = %s and apartment_user_id = %s"
  val = (file.filename, old_filename, id, host)
  cur.execute(sql, val)
  mysql.connection.commit()
  response = jsonify({'success': 'true'})
  return response

@app.route('/apartment/add_rating', methods=['POST'])
#I also have to update the apartment table
def apartment_add_rating():
  data = request.json
  cur = mysql.connection.cursor()
  sql = "update table reservation set rating = %s where id = %s"
  val = (data['rating'], data['id'])
  cur.execute(sql, val)
  mysql.connection.commit()
  return jsonify({"success": "true"})

@app.route('/apartment/add_review', methods=['POST'])
#I also have to update the apartment table
def apartment_add_review():
  data = request.json
  cur = mysql.connection.cursor()
  sql = "update table reservation set review = %s where id = %s"
  val = (data['review'], data['id'])
  cur.execute(sql, val)
  mysql.connection.commit()
  return jsonify({"success": "true"})

@app.route('/get_reviews', methods=['POST'])
def get_reviews():
  myList = []
  for i in range(6):
    myList.append({'review': 4.32, 'rating': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam bibendum, sem sed facilisis tincidunt, turpis ligula lobortis ligula, at venenatis nibh lectus eu leo. Etiam venenatis, velit ac sodales sollicitudin, felis quam faucibus metus, sed feugiat sem magna et libero. Fusce in imperdiet turpis, quis dapibus risus. Sed sit amet pulvinar enim. Pellentesque varius urna vitae lacinia commodo. Phasellus nec cursus nulla.'})
  return jsonify(myList)

@app.route('/dummy_search', methods=['POST'])
def dummy_search():
  print(request.json)
  myList = []
  for i in range(4):
    myList.append({"id": i+1, "name": "Name", "image":"1.webp", "city": "Athens", "region": "Glyfada",
    "beds": 2, "bathrooms": 2, "kitchens": 3, "smoking": 1, "pets": 1, "minDays": 3, "type": "Apartment",
    "rating": 4, "costPerNight": 120, "tv": 1, "wifi": 1, "airCondition": 1, "parking": 1, "elevator": 1, "reviews": 4})
  return jsonify(myList)


if __name__ == '__main__':
  app.run()