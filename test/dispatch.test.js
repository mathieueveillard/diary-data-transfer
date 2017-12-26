import parse from "xml-parser"
import {dispatch} from "../src/dispatch"
import assert from "assert"

describe("#dispatch()", function() {

    it("should ignore non-paragraphs", function() {
        const xml = `<nothing/>`
        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result, null)
    })
    
    it("should ignore empty paragraphs", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:jc w:val="left"/>
            </w:pPr>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result, null)
    })
    
    it("date: should ignore tags other than 'w:r' and 'w:t'", function() {

        const xml = `
        <w:p w14:paraId="0D9716AF" w14:textId="3F66E9E7" w:rsidR="002C6004" w:rsidRDefault="00477B28" w:rsidP="0011353B">
            <w:pPr>
                <w:pStyle w:val="MaDate"/>
            </w:pPr>
            <w:r>
                <w:lastRenderedPageBreak/>
                <w:t>1</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.date.day, 1)
    })
    
    it("date: should ignore non-numeric contents", function() {

        const xml = `
        <w:p w14:paraId="0D9716AF" w14:textId="3F66E9E7" w:rsidR="002C6004" w:rsidRDefault="00477B28" w:rsidP="0011353B">
            <w:pPr>
                <w:pStyle w:val="MaDate"/>
            </w:pPr>
            <w:r>
                <w:t>Dimanche 1</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.date.day, 1)
    })
    
    it("date: should ignore non-numeric contents except months (non case-sensitive)", function() {

        const xml = `
        <w:p w14:paraId="0D9716AF" w14:textId="3F66E9E7" w:rsidR="002C6004" w:rsidRDefault="00477B28" w:rsidP="0011353B">
            <w:pPr>
                <w:pStyle w:val="MaDate"/>
            </w:pPr>
            <w:r>
                <w:t>Février</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.date.month, 1)
    })
    
    it("date: should set year according to argument", function() {

        const xml = `
        <w:p w14:paraId="0D9716AF" w14:textId="3F66E9E7" w:rsidR="002C6004" w:rsidRDefault="00477B28" w:rsidP="0011353B">
            <w:pPr>
                <w:pStyle w:val="MaDate"/>
            </w:pPr>
            <w:r>
                <w:t>1</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj, 2016)
        assert.equal(result.date.year, 2016)
    })
    
    it("date: should set year according to default value if no argument is provided", function() {

        const xml = `
        <w:p w14:paraId="0D9716AF" w14:textId="3F66E9E7" w:rsidR="002C6004" w:rsidRDefault="00477B28" w:rsidP="0011353B">
            <w:pPr>
                <w:pStyle w:val="MaDate"/>
            </w:pPr>
            <w:r>
                <w:t>1</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.date.year, (new Date()).getFullYear())
    })
    
    it("date: should set day, month, year, hours and minutes", function() {

        const xml = `
        <w:p w14:paraId="0D9716AF" w14:textId="3F66E9E7" w:rsidR="002C6004" w:rsidRDefault="00477B28" w:rsidP="0011353B">
            <w:pPr>
                <w:pStyle w:val="MaDate"/>
            </w:pPr>
            <w:r>
                <w:lastRenderedPageBreak/>
                <w:t>Dimanche</w:t>
            </w:r>
            <w:r w:rsidR="002C6004">
                <w:t xml:space="preserve">
                </w:t>
            </w:r>
            <w:r>
                <w:t>
                    1
                </w:t>
            </w:r>
            <w:r w:rsidRPr="00477B28">
                <w:rPr>
                    <w:vertAlign w:val="superscript"/>
                </w:rPr>
                <w:t>
                    er
                </w:t>
            </w:r>
            <w:r>
                <w:t xml:space="preserve">
                </w:t>
            </w:r>
            <w:r w:rsidR="002C6004">
                <w:t>
                    février
                </w:t>
            </w:r>
            <w:r w:rsidR="001A2A94">
                <w:t xml:space="preserve">
                </w:t>
            </w:r>
            <w:r>
                <w:t>
                    – 23
                </w:t>
            </w:r>
            <w:r w:rsidR="00D55DF0">
                <w:t>
                    :
                </w:t>
            </w:r>
            <w:r>
                <w:t>
                    54
                </w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj, 2016)
        assert.equal(result.date.day, 1)
        assert.equal(result.date.month, 1)
        assert.equal(result.date.year, 2016)
        assert.equal(result.date.hours, 23)
        assert.equal(result.date.minutes, 54)
    })
    
    it("title: should ignore tags other than 'w:r'", function() {

        const xml = `
        <w:p w14:paraId="0AEB5374" w14:textId="78AC0EFB" w:rsidR="002C6004" w:rsidRDefault="007B73CE" w:rsidP="0011353B">
            <w:pPr>
                <w:pStyle w:val="MonTitre"/>
            </w:pPr>
            <w:bookmarkStart w:id="2" w:name="_Toc492375987"/>
            <w:r>
                <w:t>Bla bla</w:t>
            </w:r>
            <w:bookmarkEnd w:id="2"/>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.title, "Bla bla")
    })
    
    it("title: should return null if no title", function() {

        const xml = `
        <w:p w14:paraId="0AEB5374" w14:textId="78AC0EFB" w:rsidR="002C6004" w:rsidRDefault="007B73CE" w:rsidP="0011353B">
            <w:pPr>
                <w:pStyle w:val="MonTitre"/>
            </w:pPr>
            <w:bookmarkStart w:id="2" w:name="_Toc492375987"/>
            <w:bookmarkEnd w:id="2"/>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result, null)
    })
    
    it("title: should return null if more than 1 title", function() {

        const xml = `
        <w:p w14:paraId="0AEB5374" w14:textId="78AC0EFB" w:rsidR="002C6004" w:rsidRDefault="007B73CE" w:rsidP="0011353B">
            <w:pPr>
                <w:pStyle w:val="MonTitre"/>
            </w:pPr>
            <w:bookmarkStart w:id="2" w:name="_Toc492375987"/>
            <w:r>
                <w:t>Mon </w:t>
            </w:r>
            <w:r>
                <w:t>titre</w:t>
            </w:r>
            <w:bookmarkEnd w:id="2"/>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.title, "Mon titre")
    })
    
    it("body: should ignore 'w:t' tags with no child tag", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MonTweet"/>
            </w:pPr>
            <w:r w:rsidRPr="00EE4EF5">
                Le texte devrait être encapsulé dans un tag
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result, null)
    })
    
    it("body: should ignore 'w:t' tags with more than 2 child tags", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MonTweet"/>
            </w:pPr>
            <w:r w:rsidRPr="00EE4EF5">
                <w:rPr>
                    <w:u w:val="single"/>
                </w:rPr>
                <w:t>un truc pas valide</w:t>
                <w:t>un truc pas valide</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result, null)
    })
    
    it("body: should handle 'w:t' tags if no inline style is associated", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MonTweet"/>
            </w:pPr>
            <w:r>
                <w:t xml:space="preserve">Voici </w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.body, "Voici")
    })
    
    it("body: should handle 'w:t' tags with italic style", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MonTweet"/>
            </w:pPr>
            <w:r w:rsidRPr="00EE4EF5">
                <w:rPr>
                    <w:i/>
                </w:rPr>
                <w:t>du texte en italique</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.body, "_du texte en italique_")
    })
    
    it("body: should handle 'w:t' tags with bold style", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MonTweet"/>
            </w:pPr>
            <w:r w:rsidRPr="00EE4EF5">
                <w:rPr>
                    <w:b/>
                </w:rPr>
                <w:t>du texte en gras</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.body, "__du texte en gras__")
    })
    
    it("body: should handle 'w:t' tags with strike style", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MonTweet"/>
            </w:pPr>
            <w:r w:rsidRPr="00EE4EF5">
                <w:rPr>
                    <w:strike/>
                </w:rPr>
                <w:t>du texte barré</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.body, "~~du texte barré~~")
    })
    
    it("body: should handle 'w:t' tags with underline style", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MonTweet"/>
            </w:pPr>
            <w:r w:rsidRPr="00EE4EF5">
                <w:rPr>
                    <w:u w:val="single"/>
                </w:rPr>
                <w:t>du texte souligné</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.body, "du texte souligné")
    })
    
    it("body: should handle 'w:p' tags with many 'w:t' tags", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MonTweet"/>
            </w:pPr>
            <w:r>
                <w:t xml:space="preserve">Voici </w:t>
            </w:r>
            <w:r w:rsidRPr="00EE4EF5">
                <w:rPr>
                    <w:i/>
                </w:rPr>
                <w:t>du texte en italique</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.body, "Voici _du texte en italique_")
    })
    
    it("body: should handle 'w:t' tags with vertAlign style", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MonTweet"/>
            </w:pPr>
            <w:r w:rsidR="00892CFC">
                <w:t xml:space="preserve">La N</w:t>
            </w:r>
            <w:r w:rsidR="00892CFC" w:rsidRPr="00892CFC">
                <w:rPr>
                    <w:vertAlign w:val="superscript"/>
                </w:rPr>
                <w:t>ième</w:t>
            </w:r>
            <w:r w:rsidR="00892CFC">
                <w:t xml:space="preserve">fois</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.body, "La Nième fois")
    })
    
    it("body: should handle 'w:t' tags with vertAlign (edge case)", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MonTweet"/>
            </w:pPr>
            <w:r w:rsidR="00892CFC" w:rsidRPr="00892CFC">
                <w:rPr>
                    <w:vertAlign w:val="superscript"/>
                </w:rPr>
                <w:t>ième</w:t>
            </w:r>
            <w:r w:rsidR="00892CFC">
                <w:t xml:space="preserve">fois</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.body, "ième fois")
    })
    
    it("body: should handle 'w:t' tags with vertAlign (edge case 2)", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MonTweet"/>
            </w:pPr>
            <w:r w:rsidR="00892CFC">
                <w:t xml:space="preserve">La N</w:t>
            </w:r>
            <w:r w:rsidR="00892CFC" w:rsidRPr="00892CFC">
                <w:rPr>
                    <w:vertAlign w:val="superscript"/>
                </w:rPr>
                <w:t>ième</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.body, "La Nième")
    })
    
    it("body: should handle 'w:t' tags with vertAlign (edge case 3)", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MonTweet"/>
            </w:pPr>
            <w:r w:rsidR="00892CFC">
                <w:t xml:space="preserve">La N</w:t>
            </w:r>
            <w:r w:rsidR="00892CFC" w:rsidRPr="00892CFC">
                <w:rPr>
                    <w:vertAlign w:val="superscript"/>
                </w:rPr>
                <w:t>ième</w:t>
            </w:r>
            <w:r w:rsidR="00892CFC" w:rsidRPr="00892CFC">
                <w:rPr>
                    <w:vertAlign w:val="superscript"/>
                </w:rPr>
                <w:t>ième</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.body, "La Nième ième")
    })
    
    it("body: should handle 'w:t' tags with content starting with .", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MonTweet"/>
            </w:pPr>
            <w:r w:rsidR="00892CFC">
                <w:t xml:space="preserve">La fin</w:t>
            </w:r>
            <w:r w:rsidR="00892CFC">
                <w:t xml:space="preserve">.</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.body, "La fin.")
    })
    
    it("body: should handle MonParagraphe style", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MonParagraphe"/>
            </w:pPr>
            <w:r>
                <w:t xml:space="preserve">Voici </w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.body, "Voici")
    })
    
    it("body: should handle MaCitation style", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MaCitation"/>
            </w:pPr>
            <w:r>
                <w:t xml:space="preserve">Voici </w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.body, "> Voici")
    })
    
    it("body: should transform inline styles described as xml to markdown", function() {

        const xml = `
        <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
            <w:pPr>
                <w:pStyle w:val="MonTweet"/>
            </w:pPr>
            <w:r>
                <w:t xml:space="preserve">Voici </w:t>
            </w:r>
            <w:r w:rsidRPr="00EE4EF5">
                <w:rPr>
                    <w:i/>
                </w:rPr>
                <w:t>du texte en italique</w:t>
            </w:r>
            <w:r>
                <w:t xml:space="preserve"> et </w:t>
            </w:r>
            <w:r w:rsidRPr="00EE4EF5">
                <w:rPr>
                    <w:b/>
                </w:rPr>
                <w:t>du texte en gras</w:t>
            </w:r>
            <w:r>
                <w:t xml:space="preserve"> ainsi que </w:t>
            </w:r>
            <w:r w:rsidRPr="00EE4EF5">
                <w:rPr>
                    <w:u w:val="single"/>
                </w:rPr>
                <w:t>du texte souligné par le</w:t>
            </w:r>
            <w:r w:rsidRPr="00EE4EF5">
            </w:r>
            <w:r w:rsidRPr="00EE4EF5">
                <w:rPr>
                    <w:u w:val="single"/>
                </w:rPr>
                <w:t>un truc pas valide</w:t>
                <w:t>un truc pas valide</w:t>
            </w:r>
            <w:r w:rsidR="00892CFC">
                <w:t xml:space="preserve">1</w:t>
            </w:r>
            <w:r w:rsidR="00892CFC" w:rsidRPr="00892CFC">
                <w:rPr>
                    <w:vertAlign w:val="superscript"/>
                </w:rPr>
                <w:t>er</w:t>
            </w:r>
            <w:r>
                <w:t xml:space="preserve">lecteur</w:t>
            </w:r>
            <w:r>
                <w:t xml:space="preserve">.</w:t>
            </w:r>
        </w:p>`

        const obj = parse(xml).root
        const result = dispatch(obj)
        assert.equal(result.body, "Voici _du texte en italique_ et __du texte en gras__ ainsi que du texte souligné par le 1er lecteur.")
    })
})