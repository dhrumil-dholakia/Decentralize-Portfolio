import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { FaDonate } from 'react-icons/fa';
import { Modal, ModalHeader, ModalBody, Row, Button } from 'reactstrap';
import './Projects.css';

const FIXED_WALLET_ADDRESS = "0x0aa8E00632bC6b3730bB524698F9be8CBD080499";

const Projects = ({ state, setState }) => {
    const [modal, setModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const connectWallet = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setAccount(accounts[0]);
                    window.ethereum.on('accountsChanged', (newAccounts) => {
                        setAccount(newAccounts[0]);
                    });
                    setState(prevState => ({ ...prevState, web3, accounts, contract: prevState.contract }));
                } catch (error) {
                    console.error('Error connecting wallet:', error);
                }
            } else {
                alert('MetaMask not detected!');
            }
        };
        connectWallet();
    }, [setState]);

    useEffect(() => {
        const fetchProjects = async () => {
            if (state?.contract) {
                try {
                    const { contract } = state;
                    const projects = await contract.methods.getAllProjects().call();
                    console.log('Fetched Projects:', projects);
                    setProjects(projects);
                } catch (error) {
                    console.error('Error fetching projects:', error);
                }
            }
        };
        fetchProjects();
    }, [state]);

    const donateEth = async (event) => {
        event.preventDefault();
        try {
            const { web3 } = state;
            const eth = document.querySelector('#eth').value;
            const weiValue = web3.utils.toWei(eth, 'ether');
            const accounts = await web3.eth.getAccounts();
            
            await web3.eth.sendTransaction({
                from: accounts[0],
                to: FIXED_WALLET_ADDRESS,
                value: weiValue,
                gas: 480000,
            });

            alert('Transaction Successful');
        } catch (error) {
            alert('Transaction Not Successful');
            console.error('Donation error:', error);
        }
    };

    return (
        <section className="project-section">
            <h1 className="title">Projects</h1>
            <p>Connected Account: {account || 'Not Connected'}</p>
            <div className="card-wrapper">
                {projects.length > 0 ? (
                    projects.map((project, index) => (
                        <a
                            key={index}
                            href={`https://github.com/kshitijofficial/${project.githubLink}`}
                            className="project-card"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="card-img">
                                <img
                                    src={`https://gateway.pinata.cloud/ipfs/${project.image}`}
                                    alt={project.name}
                                />
                            </div>
                            <div className="card-text">
                                <h3>{project.name}</h3>
                                <p>{project.description}</p>
                            </div>
                        </a>
                    ))
                ) : (
                    <p>No projects found or loading...</p>
                )}
            </div>

            <Modal size="md" isOpen={modal} toggle={() => setModal(!modal)}>
                <ModalHeader toggle={() => setModal(!modal)}>
                    Enter the ETH you want to donate!
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={donateEth}>
                        <Row>
                            <input id="eth" type="text" required />
                            <Button className="mt-4">Send</Button>
                        </Row>
                    </form>
                </ModalBody>
            </Modal>

            <p className="donate" onClick={() => setModal(true)}>
                Liked the projects? Consider donating ETH{' '}
                <FaDonate className="icon" />
            </p>
        </section>
    );
};

export default Projects;
