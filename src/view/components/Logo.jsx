import LogoResource from "../../assets/logo.png";

const Logo = ({ height="300", width="300"}) => {
    return (
        <img src={LogoResource} height={height} width={width} />
    )
}

export default Logo