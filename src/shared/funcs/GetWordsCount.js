function getWordsCount(str) {                            
    return (
        str
            .split(' ')
            .filter(n => n != '')
            .length
    );
}