import React, { SetStateAction, useMemo, useState } from 'react'
import { Modal, Text, TextInput, View } from 'react-native'
import { blue, lightGray } from '../assets/colors'
import CustomText from './CustomText'
import { MaterialIcons } from '@expo/vector-icons'
import DropDownPicker from 'react-native-dropdown-picker'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';

interface Props {
    showModal: boolean,
    setShowModal: React.Dispatch<SetStateAction<boolean>>
    fromPrice: number | null
    toPrice: number | null
    setFromPrice: React.Dispatch<SetStateAction<number | null>>
    setToPrice: React.Dispatch<SetStateAction<number | null>>
    sortValue: string
    setSortValue: React.Dispatch<SetStateAction<string>>
    category: string
    navigation: any
}

export const categories = [
    { label: 'Houses', value: 'houses' },
    { label: 'Furniture', value: 'furniture' },
    { label: 'Cars', value: 'cars' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Games', value: 'games' },
    { label: 'Fashion', value: 'fashion' }
]

const FilterModal = ({ showModal, setShowModal, category, navigation, fromPrice, setFromPrice, toPrice, setToPrice, sortValue, setSortValue }: Props) => {

    const [categoryInputOpen, setCategoryInputOpen] = useState(false);
    const [categoryValue, setCategoryValue] = useState(category);
    const [categoryItems, setCategoryItems] = useState(categories);

    const radioButtons: RadioButtonProps[] = useMemo(() => ([
        {
            id: 'default', 
            label: 'Default',
            value: 'default',
            color: lightGray
        },
        {
            id: 'lth', 
            label: 'Lowest To Highest',
            value: 'lth',
            color: lightGray
        },
        {
            id: 'htl',
            label: 'Highest To Lowest',
            value: 'htl',
            color: lightGray
        }
    ]), []);

    return (
        <Modal visible={showModal} animationType='slide' onRequestClose={() => setShowModal(false)}>
            <View style={{ backgroundColor: blue, flex: 1, padding: 20, gap: 40 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <CustomText style={{ color: 'white', fontSize: 24 }}>Filters</CustomText>
                    <MaterialIcons name="keyboard-arrow-down" size={40} color="orange" onPress={() => setShowModal(false)} />
                </View>

                <View>
                    <CustomText style={{ color: 'white', marginBottom: 10 }}>Category</CustomText>
                    <DropDownPicker
                        style={{  backgroundColor: 'transparent', borderColor: lightGray }}
                        dropDownContainerStyle={{ backgroundColor: blue, borderColor: lightGray }}
                        textStyle={{ color: lightGray }}
                        labelStyle={{ color: lightGray }}
                        arrowIconStyle={{ tintColor: lightGray } as any}
                        placeholder={categoryValue} open={categoryInputOpen} value={categoryValue} items={categoryItems} setOpen={setCategoryInputOpen} setValue={setCategoryValue} setItems={setCategoryItems}
                        onChangeValue={(value) => navigation.setParams({ category: value?.toLowerCase() })}
                    />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ width: '45%' }}>
                        <CustomText style={{ color: lightGray, marginBottom: 10 }}>From</CustomText>
                        <View style={{ borderWidth: 1, borderColor: lightGray, borderRadius: 5, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                            <TextInput defaultValue={fromPrice ? fromPrice.toString() : ''} onChangeText={(value) => setFromPrice(Number(value) || null)} inputMode='decimal' style={{ color: lightGray, flex: 1 }}/>
                            <Text style={{ color: lightGray, opacity: 0.7 }}>USD</Text>
                        </View>
                    </View>
                    <View style={{ width: '45%' }}>
                        <CustomText style={{ color: lightGray, marginBottom: 10 }}>To</CustomText>
                        <View style={{ borderWidth: 1, borderColor: lightGray, borderRadius: 5, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                            <TextInput defaultValue={toPrice ? toPrice.toString() : ''} onChangeText={(value) => setToPrice(Number(value) || null)} inputMode='decimal' style={{ color: lightGray, flex: 1 }}/>
                            <Text style={{ color: lightGray, opacity: 0.7 }}>USD</Text>
                        </View>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-start' }}>
                    <CustomText style={{ color: lightGray, marginBottom: 10 }}>Sorting by Price</CustomText>
                    <RadioGroup 
                        radioButtons={radioButtons} 
                        onPress={(value) => setSortValue(value)}
                        selectedId={sortValue}
                        labelStyle={{ color: 'white' }}
                        containerStyle={{ gap: 10, alignItems: 'flex-start' }}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default FilterModal