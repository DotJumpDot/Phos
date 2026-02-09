#!/bin/bash

echo "🔧 Setting up Python virtual environment for {{projectName}}..."

# Create virtual environment
python3 -m venv venv

echo "✅ Virtual environment created"

# Activate and install dependencies
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Dependencies installed"
echo ""
echo "🚀 Setup complete!"
echo ""
echo "To activate the virtual environment, run:"
echo "  source venv/bin/activate"
echo ""
echo "To run the application:"
echo "  python src/main.py"
