import { useState, useEffect } from "react";
import { SlCalender } from "react-icons/sl";
import "./Experience.css";

const Experience = ({ state }) => {
    const [education, setEducation] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!state.contract) return;

            try {
                // Fetch education details from the smart contract
                const educationData = await state.contract.methods.getAllEducationDetails().call();
                setEducation(educationData);

                // Fetch experience details from the smart contract
                const experienceData = await state.contract.methods.getAllExperienceDetails().call();
                setExperiences(experienceData);
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [state.contract]);

    return (
        <section className="exp-section">
            <h1 className="title">Experience & Education</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="container">
                    {/* Education Section */}
                    <div className="education">
                        <h1 className="edu-title">Education</h1>
                        {education.length > 0 ? (
                            education.map((edu, index) => (
                                <div key={index} className="edu-card">
                                    <p className="card-text1">
                                        <SlCalender className="icon" /> {edu.date}
                                    </p>
                                    <h3 className="card-text2">{edu.degree}</h3>
                                    <p className="card-text3">{edu.knowledgeAcquired}</p>
                                    <p className="card-text4">{edu.institutionName}</p>
                                </div>
                            ))
                        ) : (
                            <p>No education details available.</p>
                        )}
                    </div>

                    {/* Experience Section */}
                    <div className="education">
                        <h1 className="edu-title">Experience</h1>
                        {experiences.length > 0 ? (
                            experiences.map((exp, index) => (
                                <div key={index} className="edu-card">
                                    <p className="card-text1">
                                        <SlCalender className="icon" /> {exp.date}
                                    </p>
                                    <h3 className="card-text2">{exp.position}</h3>
                                    <p className="card-text3">{exp.knowledgeAcquired}</p>
                                    <p className="card-text4">{exp.companyName}</p>
                                </div>
                            ))
                        ) : (
                            <p>No experience details available.</p>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Experience;
