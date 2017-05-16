# -*- coding: utf-8 -*-
"""
Created on Sun Apr 23 11:27:24 2017

@author: hd_mysky
"""

import pymongo as mongo
import pandas as pd
import os
from transform import harmonize_data

BASE_DIR = os.path.dirname(__file__)   #获取当前文件的父目录绝对路径
file_path = os.path.join(BASE_DIR,'dataset','source_simple.csv')
conn = mongo.MongoClient('mongodb://localhost:27017')
jobs = conn.lagou.jobs
cursor = jobs.find({'positionTag': '技术'})
fields = ['workYear', 'education', 'city', 'positionTag', 'financeStage', 'companySize', 'salaryAvg']
train = pd.DataFrame(list(cursor), columns=fields)
train_data = harmonize_data(train)
train_data.to_csv(file_path)
print('——————————数据转换成功——————————')
