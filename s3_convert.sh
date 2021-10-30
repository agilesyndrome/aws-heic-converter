docker run \
  --rm \
  -e AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY \
  -e AWS_REGION=us-east-2 \
  -v $PWD:/var/task lambci/lambda:nodejs8.10 \
  index.handler "{\"img\": \"$1\"}"

