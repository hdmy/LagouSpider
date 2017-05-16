def harmonize_data(data):
    import numpy as np
    FirCity = ["北京","上海","广州","深圳"]
    NewFirCity = ["成都","杭州","武汉","天津","南京","重庆","西安","长沙","青岛","沈阳","大连","厦门","苏州","宁波","无锡","香港特别行政区"]
    SecCity = ["福州","合肥","郑州","哈尔滨","佛山","济南","东莞","昆明","太原","南昌","南宁","温州","石家庄","长春","泉州","贵阳","常州","珠海","金华","烟台","海口","惠州","乌鲁木齐","徐州","嘉兴","潍坊","洛阳","南通","扬州","汕头"]
    ThiCity = ["兰州","桂林","三亚","呼和浩特","绍兴","泰州","银川","中山","保定","西宁","芜湖","赣州","绵阳","漳州","莆田","威海","邯郸","临沂","唐山","台州","宜昌","湖州","包头","济宁","盐城","鞍山","廊坊","衡阳","秦皇岛","吉林","大庆","淮安","丽江","揭阳","荆州","连云港","张家口","遵义","上饶","龙岩","衢州","赤峰","湛江","运城","鄂尔多斯","岳阳","安阳","株洲","镇江","淄博","郴州","南平","齐齐哈尔","常德","柳州","咸阳","南充","泸州","蚌埠","邢台","舟山","宝鸡","德阳","抚顺","宜宾","宜春","怀化","榆林","梅州","呼伦贝尔"]
    ForCity = ["临汾","南阳","新乡","肇庆","丹东","德州","菏泽","九江","江门","黄山","渭南","营口","娄底","永州","邵阳","清远","大同","枣庄","北海","丽水","孝感","沧州","马鞍山","聊城","三明","开封","锦州","汉中","商丘","泰安","通辽","牡丹江、曲靖","东营","韶关","拉萨","襄阳","湘潭","盘锦","驻马店","酒泉","安庆","宁德","四平","晋中","滁州","衡水","佳木斯、茂名","十堰","宿迁","潮州","承德","葫芦岛","黄冈","本溪","绥化","萍乡","许昌","日照","铁岭","大理","淮南","延边","咸宁","信阳","吕梁","辽阳","朝阳","恩施","达州","益阳","平顶山","六安","延安","梧州","白山","阜阳","铜陵","河源","玉溪","黄石","通化","百色","乐山","抚州","钦州","阳江","池州","广元"]

    # ----删除空数据 和 把string数据转成integer表示----
    # 公司规模： 用0-5替代
    data.loc[data["companySize"] == "2000人以上", "companySize"] = 5
    data.loc[data["companySize"] == "500-2000人", "companySize"] = 4
    data.loc[data["companySize"] == "150-500人", "companySize"] = 3
    data.loc[data["companySize"] == "50-150人", "companySize"] = 2
    data.loc[data["companySize"] == "15-50人", "companySize"] = 1
    data.loc[(data["companySize"] == "少于15人") | (data["companySize"] == "无"), "companySize"] = 0
    data["companySize"] = data["companySize"].fillna(data["companySize"].median())
    # data.dropna(axis=0, how='any', inplace=True)
    # axis 轴，0是行，1是列;how 删除条件，any--任意一个为nan则删除整行/列,all--整行/列为nan才删除;inplace 是否在原DataFrame上进行删除

    # 工作经验： 用0-6替代
    data.loc[data["workYear"] == "不限", "workYear"] = 0
    data.loc[data["workYear"] == "应届毕业生", "workYear"] = 1
    data.loc[data["workYear"] == "1年以下", "workYear"] = 2
    data.loc[data["workYear"] == "1-3年", "workYear"] = 3
    data.loc[data["workYear"] == "3-5年", "workYear"] = 4
    data.loc[data["workYear"] == "5-10年", "workYear"] = 5
    data.loc[data["workYear"] == "10年以上", "workYear"] = 6
    # 学历要求： 用0-4替代
    data.loc[data["education"] == "不限", "education"] = 0
    data.loc[data["education"] == "本科", "education"] = 1
    data.loc[data["education"] == "硕士", "education"] = 2
    data.loc[data["education"] == "博士", "education"] = 3
    data.loc[data["education"] == "大专", "education"] = 4
    # 城市： 用0-5替代
    data['cityTier']=5   # 插入新列cityTier，默认为五线城市，避免遗漏
    data.loc[data["city"].isin(FirCity), "cityTier"] = 0
    data.loc[data["city"].isin(NewFirCity), "cityTier"] = 1
    data.loc[data["city"].isin(SecCity), "cityTier"] = 2
    data.loc[data["city"].isin(ThiCity), "cityTier"] = 3
    data.loc[data["city"].isin(ForCity), "cityTier"] = 4
    data.drop('city',axis=1,inplace=True)
    
    cate=[]
    finance=[]
    # 职位类别：用0-9替代
    for i in data['positionTag']: 
        if '后端开发' in i:i=0
        elif '移动开发' in i:i=1
        elif '前端开发' in i:i=2
        elif '测试' in i:i=3
        elif '运维' in i:i=4
        elif 'DBA' in i:i=5
        elif '高端职位' in i:i=6
        elif '项目管理' in i:i=7
        elif '硬件开发' in i:i=8
        elif '企业软件' in i:i=9
        cate.append(i)
    # 融资阶段：用0-5替代
    for i in data['financeStage']: 
        if ~i.find("无"):i=0
        elif  ~i.find("初创型"):i=1
        elif  ~i.find("成长型"):i=2
        elif  ~i.find("成熟型"):i=3
        elif  ~i.find("上市公司"):i=4
        elif  ~i.find("不需要融资"):i=5
        finance.append(i)
    data['positionTag']= cate
    data['financeStage']= finance

    # 工资级别：用0-4替代
    # data.loc[(data["salaryAvg"]>0) & (data["salaryAvg"]<=6), "salaryAvg"] = 0
    # data.loc[(data["salaryAvg"]>6) & (data["salaryAvg"]<=10), "salaryAvg"] = 1
    # data.loc[(data["salaryAvg"]>10) & (data["salaryAvg"]<=15), "salaryAvg"] = 2
    # data.loc[(data["salaryAvg"]>15) & (data["salaryAvg"]<=30), "salaryAvg"] = 3
    # data.loc[(data["salaryAvg"]>30) & (data["salaryAvg"]<=100), "salaryAvg"] = 4
    if(data.shape[1] > 6):
        data.loc[(data["salaryAvg"]>0) & (data["salaryAvg"]<=10), "salaryAvg"] = 0
        data.loc[(data["salaryAvg"]>10) & (data["salaryAvg"]<=30), "salaryAvg"] = 1
        data.loc[(data["salaryAvg"]>30) & (data["salaryAvg"]<=100), "salaryAvg"] = 2
    return data