# This file will be used to process images using AI

import boto3
from typing import Dict, List, Any
import base64


def get_image_labels(image_buffer: bytes, rekognition: boto3.client) -> Dict[str, Any]:
    """
    Process an image using AWS Rekognition to detect faces and labels.

    Args:
        image_buffer (bytes): The image data as bytes

    Returns:
        Dict[str, Any]: Dictionary containing detected faces and labels
    """

    try:
        # Detect faces
        face_response = rekognition.detect_faces(
            Image={"Bytes": image_buffer}, Attributes=["ALL"]
        )

        # Detect labels
        label_response = rekognition.detect_labels(
            Image={"Bytes": image_buffer}, MaxLabels=10, MinConfidence=70
        )

        return {
            "faces": face_response,
            "labels": label_response
        }

    except Exception as e:
        return {"error": str(e), "faces": [], "labels": []}
