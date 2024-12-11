# backend/scripts/format.sh
#!/bin/bash
set -e

# 先運行 isort，再運行 black
echo "Running isort..."
isort --profile black --line-length 120 .

echo "Running black..."
black --line-length 120 .

echo "Running flake8..."
flake8 --config=.flake8

echo "All done! ✨ 🍰 ✨"