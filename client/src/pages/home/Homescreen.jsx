import map from '../../images/map.svg'
import './homescreen.css'

export default function Homescreen() {
    return (
        <div className="homescreen">
            <div className="homescreenWrapper">
                <div className="hs1">
                    <div className="hs1Wrapper">
                        <h1>Welcome to Desto</h1>
                        <h2>Build on the</h2>
                        <h2>decentralized cloud.</h2>
                        <button>Start now</button>
                    </div>
                </div>
                <div className="hs2">
                    <img src={map} alt="" />
                </div>
            </div>
        </div>
    )
}