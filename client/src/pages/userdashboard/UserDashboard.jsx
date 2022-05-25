import React, { Fragment, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Message from '../../components/message/Message';
import Progress from '../../components/progress/Progress';
import './userdashboard.css'
import { Web3Storage } from 'web3.storage'
import { AppContext } from '../../context/appContext/AppContext';
import { CircularProgress, makeStyles, createStyles } from "@material-ui/core";

export default function UserDashboard() {
    const [file, setFile] = useState();
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(35);
    const reader = new FileReader();
    const { authenticated, user, dispatch } = useContext(AppContext);
    const [fileDetails, setFileDetails] = useState({});
    const [filesInfo, setFilesInfo] = useState([]);

    const [isFetching, setIsFetching] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const getfileData = async () => {
        setIsFetching(true)
        try {
            const res = await axios.post('/api/auth/fetchfiles', { userUid: user._id });
            console.log("fileData", res)
            setFilesInfo(res.data.filesData)
            // console.log("res", res);
            setIsFetching(false)
        } catch (err) {
            console.log(err)
            setIsFetching(false)
        }
    }

    useEffect(() => {
        getfileData();
    }, [user])

    const onChange = e => {
        setFile([...e.target.files]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async e => {
        e.preventDefault();
        if (file) {
            setIsFetching(true)
            try {

                function getAccessToken() {
                    return process.env.REACT_APP_WEB3STORAGE_TOKEN
                }

                function makeStorageClient() {
                    return new Web3Storage({ token: getAccessToken() })
                }

                async function storeFiles() {
                    const client = makeStorageClient()
                    const cid = await client.put(file)
                    // console.log('stored files with cid:', cid)
                    try {
                        const config = {
                            header: {
                                "Content-Type": "application/json"
                            }
                        }
                        const { data } = axios.post("/api/auth/upload", {
                            cidValue: cid,
                            userUid: user._id,
                            userName: user.fullname,
                            userEmail: user.email,
                            userImg: user.profileImg,
                            filename: filename
                        }, config).catch(err => {

                            if (err.response.status === 409) {
                                console.log('error')
                            } else {
                                console.log("Internal Server Error")
                            }
                        });

                        setIsFetching(false);
                        getfileData();
                    } catch (err) {
                        setIsFetching(false)
                    }
                    // return cid
                }
                storeFiles();
                // async function storeWithProgress() {
                //     const onRootCidReady = cid => {
                //         console.log('uploading files with cid:', cid)
                //         setFileDetails({
                //             ...fileDetails, cidValue: cid, userUid: user._id,
                //             userName: user.fullname, userEmail: user.email,
                //             userImg: user.profileImg, filename: filename
                //         })

                //         const config = {
                //             header: {
                //                 "Content-Type": "application/json"
                //             }
                //         }


                //         try {
                //             const { data } = axios.post("/api/auth/upload", {
                //                 cidValue: cid, userUid: user._id,
                //                 userName: user.fullname, userEmail: user.email,
                //                 userImg: user.profileImg, filename: filename
                //             }, config).catch(err => {

                //                 if (err.response.status === 409) {
                //                     console.log('error')
                //                 } else {
                //                     console.log("Internal Server Error")
                //                 }
                //             });

                //             setIsFetching(false);
                //             getfileData();
                //         } catch (err) {
                //             setIsFetching(false)
                //         }

                //     }

                //     // when each chunk is stored, update the percentage complete and display
                //     const totalSize = file.map(f => f.size).reduce((a, b) => a + b, 0)
                //     let uploaded = 0

                //     const onStoredChunk = size => {
                //         uploaded += size
                //         const pct = totalSize / uploaded
                //         console.log(`Uploading... ${pct.toFixed(2)}% complete`)
                //         setUploadPercentage(parseFloat(pct.toFixed(2) * 100))
                //     }

                //     // makeStorageClient returns an authorized Web3.Storage client instance
                //     const client = makeStorageClient()

                //     // client.put will invoke our callbacks during the upload
                //     // and return the root cid when the upload completes
                //     return client.put(file, { onRootCidReady, onStoredChunk })
                // }
                // storeWithProgress()
            } catch (err) {
                if (err.response.status === 500) {
                    setMessage('There was a problem with the server');
                } else {
                    setMessage(err.response.data.msg);
                }
            }
        }else{
            alert("Please Select files to upload");
        }
    };

    const copyLink = (e) => {
        e.preventDefault();
        let url = e.target.getAttribute('name');
        navigator.clipboard.writeText(url);
        alert("Copied the link: " + url);
    }
    return (
        <div className='dashboard'>
            <div className="dashboard-wrapper">
                <div className="uploadDiv">
                    {/* {message ? <Message msg={message} /> : null} */}
                    <form onSubmit={onSubmit}>
                        <div className='inputDiv'>
                            <div className='custom-file'>
                                <input
                                    type='file'
                                    name='file1'
                                    className='custom-file-input'
                                    id='customFile'
                                    onChange={onChange}
                                />
                                <label className='custom-file-label' >
                                    {filename}
                                </label>
                            </div>
                            <label className='custom-file-button' htmlFor='customFile'>Browse</label>
                        </div>
                        {/* <Progress percentage={uploadPercentage} /> */}
                        <div className="upldStatus">
                            {
                                isFetching ?
                                    <><CircularProgress /> <span> Uploading...</span></>
                                    : null
                            }
                        </div>

                        <button
                            type='submit'
                            className='upload-button'
                            disabled={isFetching}
                        >Upload</button>
                    </form>
                    {/* {uploadedFile ? (
                        <div className='row mt-5'>
                            <div className='col-md-6 m-auto'>
                                <h3 className='text-center'>{uploadedFile.fileName}</h3>
                                <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
                            </div>
                        </div>
                    ) : null} */}
                </div>

                <div className="allfilesDiv">
                    <h1>
                        All Files
                    </h1>
                    <div className="contentDiv1">
                        <div className="contentDate1">
                            <span>Upload Date</span>
                        </div>
                        <div className="contentHash1">
                            <span>Content ID</span>
                        </div>
                        <div className="contentDown1">
                            <span>Download</span>
                        </div>
                    </div>
                    {
                        filesInfo.map((file) => {
                            return <div className="contentDiv">
                                <div className="contentDate">
                                    <p>{file.createdAt.split("T")[0] + " " + file.createdAt.split("T")[1].substr(0, 8)}</p>
                                </div>
                                <div className="contentHash">
                                    <p>{file.cidValue.substr(0, 50) + "....."}</p>
                                </div>
                                <div className="contentDown">
                                    <span>{file.filename}</span>
                                    <div>
                                        <i class="fas fa-solid fa-clipboard" name={`https://ipfs.io/ipfs//${file.cidValue}/${file.filename}`} onClick={copyLink}></i>
                                        <a target="_blank" href={`https://ipfs.io/ipfs//${file.cidValue}/${file.filename}`}><i class="fas fa-solid fa-download"></i></a>
                                    </div>
                                </div>
                            </div>
                        })
                    }


                    {/* <div className="contentDiv">
                        <div className="contentDate">
                            <p>20/02/2022</p>
                        </div>
                        <div className="contentHash">
                            <p>GVhGDVHVGhGhGhDVgd54d68dd98djdudlhuid5t6sdfnkskjk4ek...</p>
                        </div>
                        <div className="contentDown">
                            <span>image.jpg</span>
                            <div>
                            <i class="fas fa-regular fa-share"></i>
                            <i class="fas fa-solid fa-download"></i>
                            </div>
                        </div>
                    </div>

                    <div className="contentDiv">
                        <div className="contentDate">
                            <p>20/02/2022</p>
                        </div>
                        <div className="contentHash">
                            <p>GVhGDVHVGhGhGhDVgd54d68dd98djdudlhuid5t6sdfnkskjk4ek...</p>
                        </div>
                        <div className="contentDown">
                            <span>image.jpg</span>
                            <div>
                            <i class="fas fa-regular fa-share"></i>
                            <i class="fas fa-solid fa-download"></i>
                            </div>
                        </div>
                    </div>

                    <div className="contentDiv">
                        <div className="contentDate">
                            <p>20/02/2022</p>
                        </div>
                        <div className="contentHash">
                            <p>GVhGDVHVGhGhGhDVgd54d68dd98djdudlhuid5t6sdfnkskjk4ek...</p>
                        </div>
                        <div className="contentDown">
                            <span>image.jpg</span>
                            <div>
                            <i class="fas fa-regular fa-share"></i>
                            <i class="fas fa-solid fa-download"></i>
                            </div>
                        </div>
                    </div> */}


                </div>


            </div>
        </div>
    );
}