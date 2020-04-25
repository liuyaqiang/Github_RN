import BackPressComponent from "../../common/BackPressComponent";
import NavigationUtil from "../../navigator/NavigationUtil";

export default class AboutCommon {
    constructor(props) {
        this.props = props;
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});

    }
    onBackPress() {
        NavigationUtil.goBack(this.props.navigation);
        return true;
    }

    componentDidMount(){
        this.backPress.componentDidMount();
    }
    componentWillUnMount(){
        this.backPress.componentWillUnmount();
    }
}
