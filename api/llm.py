import boto3
import json
from typing import Dict, Any, Optional


def query_claude(user_query: str, bedrock: boto3.client) -> Dict[str, Any]:
    """
    Make a text query to Claude 3.7 Sonnet via AWS Bedrock.

    Args:
        user_query (str): The user's text query to analyze
        bedrock (boto3.client): The Bedrock client instance

    Returns:
        Dict[str, Any]: The parsed JSON object from Claude's response
    """
    # System role and prompt
    system_prompt = """
Your task is to take information about a photo and extract data from it. You are to output each of your responses in a particular format. In the provided format, any text marked with < > is a variable that you are to fill in with the appropriate data. The format is as follows:
{
  "summary": {
    "Subjects": "<Group of friends>",
    "Setting": "<Outdoors>",
    "Lighting": "<Natural daylight>",
    "Mood": "<Cheerful, friendly>",
    "Camera": "<35-50mm, f/4-5.6>",
    "Categories": "<7 analysis areas>"
  },
  "accordion": {

      "cues": [
        {
          "title": "<Connection Prompt>",
          "instruction": "<Hey guys, I want you to huddle together and tell each other about the funniest thing that happened this week.>",
          "note": "<This creates genuine laughter and natural leaning toward each other>"
        },
        {
          "title": "<Staggered Heights>",
          "instruction": "<Left person, lean slightly forward. Center person, stand up straight. Right person, pull your shoulders back a bit.>",
          "note": "<Creates the triangle composition naturally>"
        },
        {
          "title": "<Genuine Expressions>",
          "instruction": "<On the count of three, everyone shout out your favorite food! One, two...",
          "note": "<Take the photo on \"two\" to catch the anticipatory smiles rather than posed ones>"
        },
        {
          "title": "<Natural Touch Points>",
          "instruction": "<Everyone put your arms around each other's shoulders, but then just relax them a bit so it feels comfortable.>",
          "note": "<Creates connection without the stiff posed look>"
        },
        {
          "title": "<Dynamic Movement>",
          "instruction": "<Take a small step forward together on my count, but each of you look in slightly different directions.>",
          "note": "<Creates the natural head angles identified in the analysis>"
        }
      ],
    "poses": [
        "<All are posed close together (bounding boxes touch/overlap)>",
        "<All smiling, mouth open; two have eyes open, one has eyes closed>",
        "<Body language: leaning towards the center, engaging closely>",
        "<All appear cheerful, inviting, and candid>"
      ],
    "environment": [
        "<Outdoors, in front of a shelter/building (e.g., a porch, overhang, or architectural element is visible)>",
        "<Lighting is natural daylight, evenly illuminating faces with no harsh shadows>",
        "<Surroundings are not distracting and the architecture adds context but doesn't dominate the frame>"
    ],
    "technical": [
        "<Sharp image, good brightness (values: 73-84), faces clear, not overexposed>",
        "<Moderate saturation, natural skin tones>",
        "<Aspect ratio: Closest to 3:2 or 4:3 (common for group portraits)>",
        "<Focal length: 35–50mm on full-frame recommended to match framing>",
        "<Depth of field: Moderate (f/4–f/5.6) to keep all faces in focus>"
      ],
    "composition": [
        "<Place all three subjects so their faces form a slight arc or triangle across the frame>",
        "<Left subject should occupy the lower left corner, right subject higher and on the right>",
        "<Put eyeglass wearers in the center and right; no-glasses subject on the left>",
        "<Keep shoulders touching if possible for a sense of closeness/bond>",
        "<Leave a little headroom; avoid cropping at the chin or scalp>",
        "<Include a visually interesting architectural element in the background>"
      ],
    "lighting": [
        "<Soft, even daylight (overcast or shade if possible)>",
        "<No hard shadows or bright sunlight patches on faces>",
        "<No artificial flash needed unless fill is required—then use low-power, diffused>",
        "<Position subjects so light comes from slightly above and to the side for natural modeling>"
      ],
    "postprocessing": [
        "<Adjust white balance to maintain accurate skin tones (daylight/auto WB)>",
        "<Slight boost in vibrance/contrast, but keep it natural>",
        "<Sharpen lightly to enhance facial detail>",
        "<Crop to match proportions specified above if needed>",
        "<Consider subtle vignetting to draw attention to the subjects>"
    ]
  }
}

Always maintain this role and perspective in your responses."""

    # Prepare the request body for Claude
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "stop_sequences": [],
        "temperature": 1,
        "top_p": 0.999,
        "max_tokens": 2000,
        "system": system_prompt,
        "messages": [
            {"role": "user", "content": [{"type": "text", "text": user_query}]}
        ],
    }

    try:
        # Make the API call to Bedrock
        response = bedrock.invoke_model(
            modelId="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
            contentType="application/json",
            accept="application/json",
            body=json.dumps(request_body),
        )

        # Parse the response
        response_body = json.loads(response["body"].read())
        claude_response = response_body["content"][0]["text"]

        return json.loads(claude_response)

    except Exception as e:
        raise Exception(f"Error processing Claude's response: {str(e)}")
