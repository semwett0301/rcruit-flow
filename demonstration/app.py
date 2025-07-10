import streamlit as st
import requests

API_BASE = "http://localhost:3000/api/v1"  # Adjust if your backend runs elsewhere

st.title("CV Processing Workflow")

# Step 1: Upload file to /cvs/save
st.header("1. Upload CV File")
uploaded_file = st.file_uploader("Choose a CV file", type=["pdf", "doc", "docx"])

if uploaded_file:
    if st.button("Upload and Save CV"):
        files = {"file": (uploaded_file.name, uploaded_file, uploaded_file.type)}
        response = requests.post(f"{API_BASE}/cvs/save", files=files)
        if response.ok:
            save_result = response.json()
            st.success(f"File uploaded! Key: {save_result['key']}")
            st.session_state['cv_key'] = save_result['key']
        else:
            st.error(f"Upload failed: {response.text}")

# Step 2: Extract CV data from /cvs/extract
st.header("2. Extract CV Data")
cv_key = st.session_state.get('cv_key', '')
extract_data = None

if cv_key:
    st.write(f"Using file key: `{cv_key}`")
    if st.button("Extract Data from CV"):
        payload = {"fileId": cv_key}
        response = requests.post(f"{API_BASE}/cvs/extract", json=payload)
        if response.ok:
            extract_data = response.json()
            st.session_state['extract_data'] = extract_data
            st.success("Data extracted!")
            st.json(extract_data)
        else:
            st.error(f"Extraction failed: {response.text}")

# Step 3: Submit extracted data to /cvs/submit
st.header("3. Submit Extracted Data")
extract_data = st.session_state.get('extract_data', None)

if extract_data:
    st.write("Review and edit extracted data before submitting:")

    # Enums for dropdowns
    salary_period_options = ["year", "month"]
    travel_mode_options = ["car", "public transport", "bicycle", "on walk"]
    hours_a_week_options = [8, 16, 24, 32, 40]

    # Form fields
    candidateName = st.text_input("Candidate Name", extract_data.get("name", ""))
    employmentStatus = st.checkbox("Is candidate unemployed?", value=extract_data.get("employmentStatus", False))
    currentEmployer = st.text_input("Current Employer", extract_data.get("currentEmployer", ""))
    currentPosition = st.text_input("Current Position", extract_data.get("currentPosition", ""))
    age = st.number_input("Age", value=extract_data.get("age", 18), min_value=0)
    location = st.text_input("Location", extract_data.get("location", ""))
    recruiterName = st.text_input("Recruiter Name", extract_data.get("recruiterName", ""))
    contactName = st.text_input("Contact Name", extract_data.get("contactName", ""))
    hardSkills = st.text_area("Hard Skills (comma separated)", ", ".join(extract_data.get("hardSkills", [])))
    experienceDescription = st.text_area("Experience Description", extract_data.get("experienceDescription", ""))
    yearsOfExperience = st.number_input("Years of Experience", value=extract_data.get("yearsOfExperience", 0), min_value=0)
    graduationStatus = st.checkbox("Is candidate ungraduated?", value=extract_data.get("graduationStatus", False))
    degree = st.text_input("Degree", extract_data.get("degree", ""))
    targetRoles = st.text_area("Target Roles (comma separated)", ", ".join(extract_data.get("targetRoles", [])))
    ambitions = st.text_area("Ambitions", extract_data.get("ambitions", ""))
    travelMode = st.selectbox("Travel Mode", [""] + travel_mode_options, index=0 if not extract_data.get("travelMode") else travel_mode_options.index(extract_data.get("travelMode")) + 1)
    minutesOfRoad = st.text_area("Minutes of Road (comma separated)", ", ".join(map(str, extract_data.get("minutesOfRoad", []))))
    onSiteDays = st.text_area("On Site Days (comma separated)", ", ".join(map(str, extract_data.get("onSiteDays", []))))
    grossSalary = st.number_input("Gross Salary", value=extract_data.get("grossSalary", 0), min_value=0)
    salaryPeriod = st.selectbox("Salary Period", salary_period_options, index=salary_period_options.index(extract_data.get("salaryPeriod", "year")) if extract_data.get("salaryPeriod") else 0)
    hoursAWeek = st.selectbox("Hours a Week", hours_a_week_options, index=hours_a_week_options.index(extract_data.get("hoursAWeek", 40)) if extract_data.get("hoursAWeek") else 0)
    jobDescriptionText = st.text_area("Job Description Text", extract_data.get("jobDescriptionText", ""))

    if st.button("Submit Extracted Data"):
        submit_payload = {
            "candidateName": candidateName,
            "employmentStatus": employmentStatus,
            "currentEmployer": currentEmployer or None,
            "currentPosition": currentPosition or None,
            "age": age,
            "location": location,
            "recruiterName": recruiterName,
            "contactName": contactName,
            "hardSkills": [s.strip() for s in hardSkills.split(",") if s.strip()],
            "experienceDescription": experienceDescription,
            "yearsOfExperience": yearsOfExperience,
            "graduationStatus": graduationStatus,
            "degree": degree or None,
            "targetRoles": [s.strip() for s in targetRoles.split(",") if s.strip()],
            "ambitions": ambitions or None,
            "travelMode": travelMode if travelMode else None,
            "minutesOfRoad": [int(s) for s in minutesOfRoad.split(",") if s.strip().isdigit()],
            "onSiteDays": [int(s) for s in onSiteDays.split(",") if s.strip().isdigit()],
            "grossSalary": grossSalary,
            "salaryPeriod": salaryPeriod,
            "hoursAWeek": hoursAWeek,
            "jobDescriptionText": jobDescriptionText or None,
            # jobDescriptionFile is not handled in this demo
        }
        response = requests.post(f"{API_BASE}/emails/generate", json=submit_payload)
        if response.ok:
            st.success("CV submitted successfully!")
            st.json(response.json())
        else:
            st.error(f"Submission failed: {response.text}")