export default function compareObjChanges(value1, value2) {
    //  console.log('values one ',value1)
    //  console.log('values two',value2)
    return JSON.stringify(value1) !== JSON.stringify(value2);
}