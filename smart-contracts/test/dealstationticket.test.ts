import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers , artifacts} from "hardhat"
import { DealStationTicket,DealStationAccount,DealStationRegistry , NFT } from "../typechain-types"
import { describe } from "mocha"

describe("DealStationTicket,DealStationAccount,DealStationRegistry Contract", () => {                       
    let [owner, creator, creator2, buyer, operator ]: SignerWithAddress[] = new Array(5)
    before(async () => {   
    [owner, creator, creator2, buyer , operator] = await ethers.getSigners()  
    })
    let ticket: DealStationTicket
    let account :DealStationAccount
    let registry : DealStationRegistry
    let contractAddr :any
    let contractArtifact : any
    let contract : any
    let nft1 : NFT
    let nft2 : NFT

    const metadata = {
        name: "Eternal Soul",
        symbol: "ES",
        baseTokenURI: "www.xyz.com"
    }
    
    before(async () => {
        let saleprice = await ethers.utils.parseEther("0.001")
        
        const TicketFactory = await ethers.getContractFactory("DealStationTicket")
        ticket = await TicketFactory.deploy(metadata.baseTokenURI,saleprice)

        const AccountFactory = await ethers.getContractFactory("DealStationAccount")
        account = await  AccountFactory.deploy()

        const RegistryFactory = await ethers.getContractFactory("DealStationRegistry")
        registry = await RegistryFactory.deploy(account.address,ticket.address)

        const NftFactory1 = await ethers.getContractFactory("NFT")
        nft1 = await NftFactory1.deploy()

        const NftFactory2 = await ethers.getContractFactory("NFT")
        nft2 = await NftFactory2.deploy()

        for (let index = 0; index < 2; index++) {
            await nft1.connect(creator).mintNFT()
        }

        await nft2.connect(creator).mintNFT()
        await nft2.connect(creator2).mintNFT()
         
    })
    describe('DealStation Ticket', () => { 
        it("Should return the right name and symbol of the token once ticket is deployed", async () => {
            expect(await ticket.baseURI()).to.be.equal(metadata.baseTokenURI)
        })
        it("Should issue only by creator and delegateIssue only by Operator",async() =>{
            let price = await ticket.saleprice()

            expect(await ticket.connect(creator).mintTicket("www.Robolox.com",{value : price})).to.emit(ticket,"AssetIssued")

            expect(ticket.mintTicket("www.RedDead.com",{value : price.sub(100)})).to.be.reverted
        
            expect(await ticket.ownerOf(1)).to.be.equal(creator.address)

        })
        it("Should not able to transfer,or burn",async() =>{
            ///Revert 
            expect(ticket.connect(creator).transferFrom(creator.address,owner.address,1)).to.be.reverted
        })
    })
    describe('DealStation Registry', () => { 
        it("Only NFT owners can create account",async() =>{
            expect(await registry.connect(creator).intiateWallet(1,[])).to.emit(registry,"AccountCreated")
        
            //one token cannot be used two times 
            expect(registry.connect(creator).intiateWallet(1,[])).
            to.be.reverted

            // if you don't have token u cannot intiate
            expect(registry.intiateWallet(1,[])).to.be.reverted

            let info = await registry.accounts(1)
            contractAddr = info.walletAccount
        })  
    })
    describe("DealStation Account",()=>{
        before(async () => {
            /// fetching the abi
            contractArtifact = await artifacts.readArtifact("DealStationAccount");
            contract = new ethers.Contract(contractAddr,contractArtifact.abi,creator)
            await contract.deployed()  

            contract = contract.connect(creator)
                        
        })
        it("to check createOffer & lock ",async () => {

            const nftaddress: string[] = [nft1.address,nft1.address,nft2.address];

            const tokens : number[] = [1,2,1]
            //// lock 
            // const nftaddress = [nft1.address,nft1.address,nft2.address]
            // const tokens = [1,2,1]

            expect(await contract.status()).to.be.equal(0)
            /// TEST CASE1 : When status is not intiated , nft cannot be locked
            expect(contract.lock(nftaddress,tokens,600)).to.be.reverted


            expect(contract.connect(creator2).createOffer(nft2.address,2,3)).to.be.reverted

            expect(await contract.createOffer(nft2.address,2,3)).to.emit(contract,"OfferCreation");

            expect(await contract.status()).to.be.equal(1)

            let offer = await contract.offer()

            expect(offer[0]).to.be.equal(nft2.address)
            expect(offer[1]).to.be.equal(2)
            expect(offer[2]).to.be.equal(3)

            ///Lock
            /// Test Case2 : when contract Address arrray length and token arrary length doesn't match
            const addr  = [nft1.address,nft2.address]
            expect(contract.lock(addr,tokens,3)).to.be.reverted

            //approval
            await nft1.connect(creator).approve(contract.address,1)
            await nft1.connect(creator).approve(contract.address,2)
            await nft2.connect(creator).approve(contract.address,1)
            
            await contract.lock(nftaddress,tokens,600)

            expect(await contract.status()).to.be.equal(2)

        })
        it("to accept offer",async () => {
            
            
          })
          
     })
   
})