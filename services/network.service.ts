import NetInfo from '@react-native-community/netinfo'

class NetworkService {
    private isConnected = true

    init() {
        NetInfo.addEventListener(state => {
            this.isConnected = !!state.isConnected
        })
    }

    getStatus() {
        return this.isConnected
    }

    async waitForConnection() {
        if (this.isConnected) return true

        return new Promise(resolve => {
            const unsub = NetInfo.addEventListener(state => {
                if (state.isConnected) {
                    unsub()
                    resolve(true)
                }
            })
        })
    }
}

export const networkService = new NetworkService()