
import WebglBackground from './WebglBackground'
import './Navigation.module.less'

const Navigation = (props: any): JSX.Element => {
  console.log(props, 'Navigation')
  return (
    <div styleName='Navigation'>
      <WebglBackground/>
    </div>
  )
}

export default Navigation
