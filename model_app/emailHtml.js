const emailContents = (num) => (`
    
    <table align="center" border="1" cellpadding="0" cellspacing="0" width="600">
    <tr>
        <td>
        <img src="../public/인트로.png" alt="Creating Email Magic" width="600 " height="600"
        style="display: block;" />
        </td>
    </tr>
    <tr>
        <td>
            Row 2
        </td>
    </tr>
    <tr>
        <td>
        <p>hi this is${num} test</p>
        </td>
    </tr>
</table>
`);

module.exports = { emailContents };