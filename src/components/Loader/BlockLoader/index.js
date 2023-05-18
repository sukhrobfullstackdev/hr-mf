import './index.scss';

function BlockLoader({type = 'text', className = ''}){

    return  <div className={`loader-block ${className}`}>
                <div className={`loader-block-effect ${type}`}/>
            </div>
}
export default BlockLoader;