function countWords(str) {
    return (
        str
            .replace(/(^\s*)|(\s*$)/gi,'')
            .replace(/[ ]{2,}/gi,' ')
            .replace(/\n /,'\n')
            .split(' ')
            .length
    );
};