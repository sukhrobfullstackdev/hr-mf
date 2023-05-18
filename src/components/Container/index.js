import './index.scss'
function Container({className,children,fluid = false}){
    return (
        <div className={`container ${fluid ? 'fluid' : ''} ${className || ''}`}>
            {children}
        </div>
    )
}
export default Container;