#!/usr/bin/env python2

import os, socket
from flask import Flask, jsonify, render_template, request

import nurse_schedule

app = Flask(__name__)

@app.route("/")
def index():
    return jsonify({"status":"ready"})

@app.route("/", methods=['POST'])
def make():
    return jsonify(nurse_schedule.make_from_json(request.json))

@app.after_request
def apply_cors(response):
    hostname = socket.gethostname()
    print("Using hostname for CORS: {0}".format(hostname))
    response.headers["Access-Control-Allow-Headers"] = "content-type"
    response.headers["Access-Control-Allow-Methods"] = "GET,HEAD,PUT,POST,DELETE,PATCH"
    response.headers["Access-Control-Allow-Origin"] = "http://{0}".format(hostname)

    return response

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3100), debug=False)
