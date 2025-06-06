# 删除某个目录下所有txt文件
rm v1/Index-results/*.txt
# 删除某个目录下所有失效的软链接
find v1/datasets -type l -xtype l -delete

# find / -name 'gvpem7_cohesion_3_3.txt' -type f -delete