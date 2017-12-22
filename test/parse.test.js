import {inlineStyleToMarkdown} from "../parse"
const assert = require("assert")

describe("Array", function() {
    describe("#inlineStyleToMarkdown()", function() {

        it("should ignore 'w:r' tags", function() {

            const xml = `
            <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
                <w:pPr>
                    <w:pStyle w:val="MonTweet"/>
                </w:pPr>
            </w:p>`

            const result = inlineStyleToMarkdown(xml)
            assert.equal(result, "")
        })
        
        it("should ignore 'w:t' tags with no child tag", function() {

            const xml = `
            <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
                <w:r w:rsidRPr="00EE4EF5">
                    Le texte devrait être encapsulé dans un tag
                </w:r>
            </w:p>`

            const result = inlineStyleToMarkdown(xml)
            assert.equal(result, "")
        })
        
        it("should ignore 'w:t' tags with more than 2 child tags", function() {

            const xml = `
            <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
                <w:r w:rsidRPr="00EE4EF5">
                    <w:rPr>
                        <w:u w:val="single"/>
                    </w:rPr>
                    <w:t>un truc pas valide</w:t>
                    <w:t>un truc pas valide</w:t>
                </w:r>
            </w:p>`

            const result = inlineStyleToMarkdown(xml)
            assert.equal(result, "")
        })
        
        it("should handle 'w:t' tags if no inline style is associated", function() {

            const xml = `
            <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
                <w:r>
                    <w:t xml:space="preserve">Voici </w:t>
                </w:r>
            </w:p>`

            const result = inlineStyleToMarkdown(xml)
            assert.equal(result, "Voici")
        })
        
        it("should handle 'w:t' tags with italic style", function() {

            const xml = `
            <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
                <w:r w:rsidRPr="00EE4EF5">
                    <w:rPr>
                        <w:i/>
                    </w:rPr>
                    <w:t>du texte en italique</w:t>
                </w:r>
            </w:p>`

            const result = inlineStyleToMarkdown(xml)
            assert.equal(result, "_du texte en italique_")
        })
        
        it("should handle 'w:t' tags with bold style", function() {

            const xml = `
            <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
                <w:r w:rsidRPr="00EE4EF5">
                    <w:rPr>
                        <w:b/>
                    </w:rPr>
                    <w:t>du texte en gras</w:t>
                </w:r>
            </w:p>`

            const result = inlineStyleToMarkdown(xml)
            assert.equal(result, "__du texte en gras__")
        })
        
        it("should handle 'w:t' tags with stike style", function() {

            const xml = `
            <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
                <w:r w:rsidRPr="00EE4EF5">
                    <w:rPr>
                        <w:strike/>
                    </w:rPr>
                    <w:t>du texte barré</w:t>
                </w:r>
            </w:p>`

            const result = inlineStyleToMarkdown(xml)
            assert.equal(result, "~~du texte barré~~")
        })
        
        it("should handle 'w:t' tags with underline style", function() {

            const xml = `
            <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
                <w:r w:rsidRPr="00EE4EF5">
                    <w:rPr>
                        <w:u w:val="single"/>
                    </w:rPr>
                    <w:t>du texte souligné</w:t>
                </w:r>
            </w:p>`

            const result = inlineStyleToMarkdown(xml)
            assert.equal(result, "du texte souligné")
        })
        
        it("should handle 'w:p' tags with many 'w:t' tags", function() {

            const xml = `
            <w:p w14:paraId="7E9C6B89" w14:textId="4AD3317F" w:rsidR="0047424E" w:rsidRDefault="0047424E" w:rsidP="003A75D3">
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

            const result = inlineStyleToMarkdown(xml)
            assert.equal(result, "Voici _du texte en italique_")
        })
        
        it("should transform inline styles described as xml to markdown", function() {

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
                    <w:t>du texte souligné</w:t>
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
                <w:r>
                    <w:t xml:space="preserve">. Voilà.</w:t>
                </w:r>
            </w:p>`

            const result = inlineStyleToMarkdown(xml)
            assert.equal(result, "Voici _du texte en italique_ et __du texte en gras__ ainsi que du texte souligné . Voilà.")
        })
    })
})