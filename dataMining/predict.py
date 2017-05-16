import sys
import os
BASE_DIR = os.path.dirname(__file__)   # 获取当前文件的父目录绝对路径
model_path = os.path.join(BASE_DIR,'model\clf.model')

def save(model=''):
    from sklearn.externals import joblib
    if(model != ''): joblib.dump(model, model_path)
    return joblib.load(model_path)

def main(data):
    from transform import harmonize_data
    feature_name = ['workYear', 'education', 'cityTier', 'positionTag', 'financeStage','companySize']
    ori_feature_name = ['workYear', 'education', 'city', 'positionTag', 'financeStage','companySize'] 
    data_transform = harmonize_data(data.copy(deep=True))
    ori_x,ori_y = data[ori_feature_name],data['salaryAvg']
    test_x,test_y = data_transform[feature_name],data_transform['salaryAvg']
    model = save()
    for i in range(data.shape[0]):
        print('测试样本特征为:',ori_x.iloc[i].values.reshape(1,-1))
        print('数值化后：',test_x.iloc[i].values.reshape(1,-1))
        predict = int(model.predict(test_x.iloc[i].values.reshape(1,-1)).reshape(-1, 1))
        print('预测薪资水平为：','0-10k' if predict == 0 else '10-30k' if predict == 1 else '30k-100k')
        # print('各水平可能性为：',model.predict_proba(test_x))
        print('正确薪资为：',ori_y[i])
        print('--------------------------------')
    print('总体准确度为：',model.score(test_x,test_y)*100,'%')

def main_sample(data):
    from transform import harmonize_data
    feature_name = ['workYear', 'education', 'cityTier', 'positionTag', 'financeStage','companySize']
    data_transform = harmonize_data(data.copy(deep=True))
    test_x = data_transform[feature_name]
    model = save()
    predict = int(model.predict(test_x.ix[0].values.reshape(1,-1)).reshape(-1, 1))
    print('0-10k' if predict == 0 else '10-30k' if predict == 1 else '30k-100k')

if __name__ == '__main__':
  import pandas as pd
  import json
  # sys.argv: [filename, param]
  # 字符串处理 /-->"
  data = json.loads(sys.argv[1].replace('\\','"'))
  main_sample(pd.DataFrame(data, index=[0]))