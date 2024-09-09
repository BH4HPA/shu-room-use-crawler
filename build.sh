#!/bin/bash
echo Going to build `git rev-parse --short HEAD` image
docker build -t ccr.ccs.tencentyun.com/shuhole/shu-room-use-crawler:`git rev-parse --short HEAD` --platform linux/amd64 .
echo Built `git rev-parse --short HEAD` image, going to push
echo Logging in
docker login --username=100035268144 ccr.ccs.tencentyun.com
echo Pushing
docker push ccr.ccs.tencentyun.com/shuhole/shu-room-use-crawler:`git rev-parse --short HEAD`