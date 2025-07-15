#!/bin/bash

# HTML压缩脚本
# 使用方法: ./compress.sh

echo "🚀 开始压缩HTML文件..."

# 备份原文件
cp index.html index.html.bak

# 压缩HTML
# 1. 移除多余空行
# 2. 移除行首行尾空格
# 3. 压缩多个空格为单个空格
# 4. 移除HTML注释（保留必要的注释）
sed -i.tmp '
    # 移除空行
    /^[[:space:]]*$/d
    # 移除行首行尾空格
    s/^[[:space:]]*//
    s/[[:space:]]*$//
    # 压缩多个空格为单个空格
    s/[[:space:]]\+/ /g
' index.html

# 检查压缩效果
original_size=$(wc -c < index.html.bak)
compressed_size=$(wc -c < index.html)
reduction=$((($original_size - $compressed_size) * 100 / $original_size))

echo "✅ 压缩完成！"
echo "原始大小: ${original_size} 字节"
echo "压缩后: ${compressed_size} 字节"
echo "压缩率: ${reduction}%"

# 清理临时文件
rm -f index.html.tmp

echo "📦 建议启用gzip压缩以获得更好效果"
gzip_size=$(gzip -c index.html | wc -c)
echo "Gzip后大小: ${gzip_size} 字节"
total_reduction=$((($original_size - $gzip_size) * 100 / $original_size))
echo "总压缩率: ${total_reduction}%"