# -*- coding: utf-8 -*-
"""
Created on Sun Apr 23 21:27:52 2017

@author: hd_mysky
"""

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import os
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

# const
BASE_DIR = os.path.dirname(__file__)   # 获取当前文件的父目录绝对路径
file_path = os.path.join(BASE_DIR,'dataset\source_simple.csv') 
model_path = os.path.join(BASE_DIR,'model\clf.model')
feature_name = ['workYear', 'education', 'cityTier', 'positionTag', 'financeStage','companySize']   # 列出对工资有影响的字段
choosen_random_state = 101
workers = -1

def init():
    train_data = pd.read_csv(file_path)
    X, y = train_data[feature_name], train_data['salaryAvg']
    return transform(X,y)

def transform(X,y):
    from sklearn.preprocessing import StandardScaler, MinMaxScaler  
    from sklearn.model_selection import train_test_split
    scaler = StandardScaler()
    return train_test_split(X, y, train_size = 0.8, random_state = choosen_random_state)

# 基于学习模型的特征排序 -- 随机森林回归
def rf_feature_improtances(X_train, y_train, feature_name):
    print('--------RF特征重要性排序--------')
    range_ = range(len(feature_name))
    feature_names = np.array([' '.join([str(b),a]) for a,b in zip(feature_name, range_)])
    rf = RandomForestRegressor(n_estimators = 100, random_state = choosen_random_state).fit(X_train, y_train)
    print("Features sorted by their score:")
    print((sorted(zip(rf.feature_importances_, feature_name), reverse=True)))
    importance = np.mean([tree.feature_importances_ for tree in rf.estimators_], axis=0)
    std = np.std([tree.feature_importances_ for tree in rf.estimators_], axis=0)   # 标准差
    indices = np.argsort(importance)

    plt.title('Random Forest importance')
    plt.barh(range_, importance[indices], color="r", xerr=std[indices], alpha=0.4, align='center')
    plt.yticks(range_, feature_names[indices])
    plt.ylim(-1, len(importance))
    plt.xlim([0.0, 0.7])
    plt.show()

# 优化指标：偏差acc（准确率）,变异系数（方差/均值）
def accAndCov(param_name,range_,X_train,y_train,X_test,y_test):
    import sklearn.metrics as metrics
    x=[]
    accs=[]
    covs=[]
    rf = RandomForestClassifier(n_jobs = workers, random_state = choosen_random_state, n_estimators = 196)
    if(len(range_) == 2):start,stop = range_
    else: 
        start,stop,unit = range_
        stop += 1
    
    def record():
        rf.fit(X_train, y_train)
        predict = rf.predict(X_test)
        score = rf.score(X_test,y_test)    # == metrics.accuracy_score(y_test, predict)
        print('使用rf.score估算的得分:',score)
        accs.append(score)
        # cov = (predict == y_test).std()/(y_test == predict).mean()
        # print('变异系数为:',cov)
        # covs.append(cov)
    # 绘制曲线、最高点、最低点
    def draw(plt,category):
        plt.xlabel(param_name)  
        plt.ylabel(category)  
        plt.title(param_name + " && " + category)
        score = accs if category == 'Acc' else covs
        if(param_name != 'criterion'):
            plt.xticks(range(start,stop,unit))
            plt.xlim(start,stop)
            plt.plot(x, score, color="red", linewidth=2)
            if category == 'Acc':
                mark = np.argmax(score)
            else:
                mark = np.argmin(score)
            plt.plot(x[mark],score[mark],'gs')
            show_text='('+ str(x[mark]) +','+ str(round(score[mark],4)) +')'    
            plt.annotate(show_text,xy=(mark,score[mark]))
        else:
            plt.xticks((0,1),range_)
            plt.xlim(0,1)
            plt.plot([0,1], score, color="red", linewidth=2)

    # 函数开始
    if(param_name == 'criterion'):
        for i in range_:
            x.append(i)
            rf.set_params(criterion=i)
            record()
    else:
        for i in range(start,stop,unit):
            x.append(i)
            if(param_name == 'n_estimators'):rf.set_params(n_estimators= i)
            elif(param_name == 'max_features'):rf.set_params(max_features = i)
            elif(param_name == 'max_depth'):rf.set_params(max_depth = i)
            elif(param_name == 'min_samples_split'):rf.set_params(min_samples_split = i)
            elif(param_name == 'min_samples_leaf'):rf.set_params(min_samples_leaf = i)
            elif(param_name == 'max_leaf_nodes'):rf.set_params(max_leaf_nodes = i)
            record()
    plt.figure(1)
    # plt.subplot(121)
    draw(plt,'Acc')
    plt.show() 
    '''
    plt.subplot(122)
    draw(plt,'Cov')
    plt.show()  
    '''

def bestParam():
    accAndCov('n_estimators',[1,201,5],X_train,y_train,X_test,y_test)
    accAndCov('criterion',['gini','entropy'],X_train,y_train,X_test,y_test)
    accAndCov('max_features',[1,6,1],X_train,y_train,X_test,y_test)
    accAndCov('max_depth',[1,100,2],X_train,y_train,X_test,y_test)
    accAndCov('min_samples_split',[10,100,2],X_train,y_train,X_test,y_test)
    accAndCov('min_samples_split',[30,60,1],X_train,y_train,X_test,y_test)
    accAndCov('min_samples_leaf',[1,10,1],X_train,y_train,X_test,y_test)
    accAndCov('max_leaf_nodes',[100,1500,100],X_train,y_train,X_test,y_test)

import sklearn.metrics as metrics
def train():
    from sklearn.ensemble import RandomForestClassifier
    n_estimators_options = 196
    max_features_options = 2
    min_samples_split_options = 2
    min_samples_leaf_options = 9
    max_leaf_nodes_options = 600
    max_depth_option = 11
    oob_score = True
    # model = RandomForestClassifier(n_jobs = workers, random_state = choosen_random_state)
    model = RandomForestClassifier(n_jobs = workers, random_state = choosen_random_state,criterion="gini",
    n_estimators=n_estimators_options,max_features=max_features_options,min_samples_leaf=min_samples_leaf_options,
    max_leaf_nodes=max_leaf_nodes_options,max_depth=max_depth_option,oob_score=oob_score)
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    probability = model.predict_proba(X_test)
    save(model)
    print('生成随机森林模型：\n', model)
    print('准确率为：', model.score(X_test,y_test))
    print('袋外评估（OOB）得分为 ：', model.oob_score_)
    print('混淆矩阵如下 ：\n', pd.crosstab(y_test, preds, rownames=['真实'], colnames=['预测']))
    classify_report = metrics.classification_report(y_test, preds)
    confusion_matrix = metrics.confusion_matrix(y_test, preds)
    overall_accuracy = metrics.accuracy_score(y_test, preds)
    acc_for_each_class = metrics.precision_score(y_test, preds, average=None)
    average_accuracy = np.mean(acc_for_each_class)
    score = metrics.accuracy_score(y_test, preds)
    print('评估指标 : \n', classify_report)
    # print('confusion_matrix : \n', confusion_matrix)
    print('平均每类正确的概率 : \n', acc_for_each_class)
    print('平均正确概率: {0:f}'.format(average_accuracy))
    print('总体正确概率: {0:f}'.format(overall_accuracy))
    # print('score: {0:f}'.format(score))

def save(model=''):
    from sklearn.externals import joblib
    if(model != ''): joblib.dump(model, model_path)
    return joblib.load(model_path)

def main():
    from predict import main as predict
    bestParam()
    train()
    rf_feature_improtances(X_train, y_train, feature_name)
    test_data = pd.DataFrame({
        'workYear':['5-10年','不限','1-3年'],
        'education':['本科','大专','本科'],
        'positionTag':['后端开发','高端职位','后端开发'],
        'financeStage':['成熟型(不需要融资)','成长型(B轮)','成长型(不需要融资)'],
        'companySize':['2000人以上','150-500人','50-150人'],
        'salaryAvg':[27.5,9.5,11.5],
        'city':['北京','北京','成都'],
    })
    predict(test_data)

def randomizedSearchCV():
    # 随机地从既定的范围内选取一个参数，估计在这个参数下算法的质量，然后选出最好的。
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import RandomizedSearchCV
    sample_leaf_options = list(range(1, 500, 3))
    n_estimators_options = list(range(1, 1000, 5))
    param_grid = {'n_estimators': n_estimators_options,'min_samples_leaf':sample_leaf_options}
    model = RandomForestClassifier(n_jobs=workers)
    rsearch = RandomizedSearchCV(estimator=model, param_distributions=param_grid, n_iter=100, scoring='accuracy')
    rsearch.fit(X_train, y_train)
    print(rsearch)
    print(rsearch.best_score_)
    print(rsearch.best_estimator_)

X_train, X_test, y_train, y_test = init()
main()