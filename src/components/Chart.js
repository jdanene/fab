import React from "react"
import { View } from "react-native"
import { Text } from 'react-native-svg' // Different from react-native Text!
import { PieChart } from "react-native-svg-charts"

const Labels = ({ slices, height, width }) => {
  return slices.map((slice, index) => {
      const { labelCentroid, pieCentroid, data } = slice;
      return (
          <Text
              key={index}
              x={pieCentroid[ 0 ]}
              y={pieCentroid[ 1 ]}
              fill={'white'}
              textAnchor={'middle'}
              alignmentBaseline={'middle'}
              fontSize={24}
              stroke={'black'}
              strokeWidth={0.2}
          >
              {data.amount}
          </Text>
      )
  })
}

const Chart = ({ data }) => {
  return (
    <View>
    <PieChart
        valueAccessor={({ item }) => item.amount}
        data={data}
        spacing={0}
        outerRadius={'95%'}
    >
        <Labels />
      </PieChart>
    </View>
  )
}

export default Chart
