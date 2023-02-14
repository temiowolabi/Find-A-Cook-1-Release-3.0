import Button from './components/Button'
import { Link} from 'react-router-dom'


const LandingPage = () => {
    return (   
        <div>
            <br></br>
            <img id="logo" alt="FindaCook logo" src="./images/logo-new-edit-01.png"/>
            <div id="btnGroup">
                    <Link style={{textDecoration: 'none'}} className="link" to="/login"><Button id="loginBtn" text='Login' /></Link>
                    <Link style={{textDecoration: 'none'}} className="link" to="/register"><Button id="RegBtn" text='Register' /></Link>
                    <Link style={{textDecoration: 'none'}} className="link" to="/cookdashboard"><Button id="guestBtn" text='Continue as Guest' /> </Link>
            </div>
        </div>
    )
}
export default LandingPage