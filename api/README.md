# API Backend

The back end consists of an API made with the FastAPI framework and run with Uvicorn.
To install these packages, it is recommended to use a virtual environment, instead of
installing the packages on your machine globally. Details below.

Conda Environment Steps:

1. conda create --name {env_name} python={some_version}
2. conda activate {env_name}
3. conda install -c conda-forge --file api/requirements.txt