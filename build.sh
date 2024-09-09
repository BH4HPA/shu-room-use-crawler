#!/bin/bash
docker build -t ccr.ccs.tencentyun.com/shuhole/shu-room-use-crawler:`git rev-parse --short HEAD` --platform linux/amd64 .
docker login --username=100035268144 ccr.ccs.tencentyun.com
docker push ccr.ccs.tencentyun.com/shuhole/shu-room-use-crawler:`git rev-parse --short HEAD`