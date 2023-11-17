import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { MagnifyingGlass } from './src/components';

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <MagnifyingGlass src="https://images-na.ssl-images-amazon.com/images/I/616HiOFb1VL._AC_UX679_.jpg" />
  </GestureHandlerRootView>
);

export default App;
