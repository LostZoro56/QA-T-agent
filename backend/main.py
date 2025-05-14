from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from agents.agent_router import AgentRouter
import uvicorn
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import asyncio
from concurrent.futures import TimeoutError
import os
import traceback
import shutil
from utils.file_processor import extract_text_from_file

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]
)

# Request models
class GenerateRequest(BaseModel):
    requirement: str
    agentType: str
    featureName: Optional[str] = None
    testName: Optional[str] = None
    language: Optional[str] = None
    iterations: Optional[int] = 2

# Initialize agent router
agent_router = AgentRouter()

@app.post("/generate")
async def generate(request: GenerateRequest):
    try:
        print(f"Received request: {request}")
        request_data = request.dict()

        try:
            # Call the appropriate agent with timeout
            response = await asyncio.wait_for(
                asyncio.to_thread(agent_router.route_request, request_data),
                timeout=30.0
            )
        except TimeoutError:
            return JSONResponse(
                status_code=408,
                content={
                    'status': 'error',
                    'message': 'Taking too long to generate. Please try with a simpler request or fewer scenarios.'
                }
            )
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={
                    'status': 'error',
                    'message': f'Unexpected error: {str(e)}'
                }
            )

        # Handle error from agent
        if response.get('status') == 'error':
            return JSONResponse(
                status_code=400,
                content={
                    'status': 'error',
                    'message': response.get('message', 'Agent returned an error')
                }
            )

        # Handle successful response
        content = response.get('content', '')
        filename = response.get('filename', '')
        feature_file = response.get('feature_file', '')
        message = response.get('message', 'Generated successfully')

        # Always return a JSON response with content
        response_data = {
            'status': 'success',
            'content': content,
            'message': message
        }
        
        # Add filename if a feature file was created
        if feature_file and os.path.exists(feature_file) and filename:
            response_data['filename'] = filename
            
        return JSONResponse(
            status_code=200,
            content=response_data
        )

    except Exception as e:
        print(f"Exception in generate endpoint: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/")
async def root():
    return {"message": "QA Test Generation API is running 🚀"}

@app.post("/generate-with-file")
async def generate_with_file(
    file: UploadFile = File(...),
    agentType: str = Form(...),
    requirement: Optional[str] = Form(None),
    featureName: Optional[str] = Form(None),
    testName: Optional[str] = Form(None),
    language: Optional[str] = Form(None),
    iterations: Optional[int] = Form(2)
):
    try:
        print(f"Received file upload: {file.filename}")
        
        # Create uploads directory if it doesn't exist
        os.makedirs("uploads", exist_ok=True)
        
        # Save the uploaded file
        file_path = os.path.join("uploads", file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Extract text from the file
        try:
            extracted_text = extract_text_from_file(file_path)
            if not extracted_text:
                return JSONResponse(
                    status_code=400,
                    content={
                        'status': 'error',
                        'message': f'Could not extract text from file: {file.filename}'
                    }
                )
        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={
                    'status': 'error',
                    'message': f'Error processing file: {str(e)}'
                }
            )
        
        # Combine extracted text with any provided requirement
        combined_requirement = ""
        if requirement and requirement.strip():
            # Format the combined requirement in a way that highlights both parts
            combined_requirement = f"User Input:\n{requirement.strip()}\n\nFile Content:\n{extracted_text}"
        else:
            combined_requirement = f"File Content:\n{extracted_text}"
        
        # Prepare request data
        request_data = {
            "requirement": combined_requirement,
            "agentType": agentType,
            "featureName": featureName,
            "testName": testName,
            "language": language,
            "iterations": iterations
        }
        
        try:
            # Call the appropriate agent with timeout
            response = await asyncio.wait_for(
                asyncio.to_thread(agent_router.route_request, request_data),
                timeout=30.0
            )
        except TimeoutError:
            return JSONResponse(
                status_code=408,
                content={
                    'status': 'error',
                    'message': 'Taking too long to generate. Please try with a simpler request or fewer scenarios.'
                }
            )
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={
                    'status': 'error',
                    'message': f'Unexpected error: {str(e)}'
                }
            )

        # Handle error from agent
        if response.get('status') == 'error':
            return JSONResponse(
                status_code=400,
                content={
                    'status': 'error',
                    'message': response.get('message', 'Agent returned an error')
                }
            )

        # Handle successful response
        content = response.get('content', '')
        filename = response.get('filename', '')
        feature_file = response.get('feature_file', '')
        message = response.get('message', 'Generated successfully')

        # Always return a JSON response with content
        response_data = {
            'status': 'success',
            'content': content,
            'message': message
        }
        
        # Add filename if a feature file was created
        if feature_file and os.path.exists(feature_file) and filename:
            response_data['filename'] = filename
            
        return JSONResponse(
            status_code=200,
            content=response_data
        )

    except Exception as e:
        print(f"Exception in generate_with_file endpoint: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/download/{filename}")
async def download_file(filename: str):
    features_dir = os.path.join(os.path.dirname(__file__), 'features')
    file_path = os.path.join(features_dir, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='text/plain',
        headers={
            'Content-Disposition': f'attachment; filename={filename}',
            'Access-Control-Expose-Headers': 'Content-Disposition'
        }
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
