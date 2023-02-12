import React, { useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import { makeStyles } from '@material-ui/core/styles';
import aveta from 'aveta';

import { Box, Card, CardContent, Button, Typography, Grid } from '@material-ui/core';

import UnlockWallet from '../../components/UnlockWallet';
import PageDashboard from '../../components/PageDashboard';

import useRedeemOnBoardroom from '../../hooks/useRedeemOnBoardroom';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import { getDisplayBalance } from '../../utils/formatBalance';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';

import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import useClaimRewardCheck from '../../hooks/boardroom/useClaimRewardCheck';
import useWithdrawCheck from '../../hooks/boardroom/useWithdrawCheck';
import ProgressCountdown from './components/ProgressCountdown';
import { createGlobalStyle } from 'styled-components';
import { Helmet } from 'react-helmet';

import HomeImage from '../../assets/img/background.jpg';

import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useBombStats from '../../hooks/useBombStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsBTC from '../../hooks/useLpStatsBTC';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usebShareStats from '../../hooks/usebShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
// import { Bomb as bombTesting } from '../../bomb-finance/deployments/deployments.testing.json';
//import { Bomb as bombProd } from '../../bomb-finance/deployments/deployments.mainnet.json';
import {round, roundAndFormatNumber } from '../../0x';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import ZapModal from '../Bank/components/ZapModal';
import { Alert } from '@material-ui/lab';
import { IoCloseOutline } from 'react-icons/io5';
import { BiLoaderAlt } from 'react-icons/bi';
import useBombFinance from '../../hooks/useBombFinance';

// MUI TABLE 
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {ReactComponent as IconDiscord} from '../../assets/img/discord.svg';
import {ReactComponent as IconDocs} from '../../assets/img/docs.svg';
import IconBoardroom from '../../assets/img/bomb32.png';
import IconBshare from '../../assets/img/bshare-200x200.png';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #020242;
  }
`;
const TITLE = 'bomb.money | Dashboard';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const { account } = useWallet();
  const { onRedeem } = useRedeemOnBoardroom();
  const stakedBalance = useStakedBalanceOnBoardroom();
  const currentEpoch = useCurrentEpoch();
  const cashStat = useCashPriceInEstimatedTWAP();
  const totalStaked = useTotalStakedOnBoardroom();
  const boardroomAPR = useFetchBoardroomAPR();
  const canClaimReward = useClaimRewardCheck();
  const canWithdraw = useWithdrawCheck();
  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const { to } = useTreasuryAllocationTimes();
  const TVL = useTotalValueLocked();
  const bombFtmLpStats = useLpStatsBTC('BOMB-BTCB-LP');
  const bShareFtmLpStats = useLpStats('BSHARE-BNB-LP');
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const bombFinance = useBombFinance();
  const buyBombAddress = //'https://app.1inch.io/#/56/swap/BTCB/BOMB';
  //  'https://pancakeswap.finance/swap?inputCurrency=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&outputCurrency=' +
  'https://app.bogged.finance/bsc/swap?tokenIn=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&tokenOut=0x522348779DCb2911539e76A1042aA922F9C47Ee3';
//https://pancakeswap.finance/swap?outputCurrency=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
const buyBShareAddress = //'https://app.1inch.io/#/56/swap/BNB/BSHARE';
  'https://app.bogged.finance/bsc/swap?tokenIn=BNB&tokenOut=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
const buyBusmAddress =
  'https://app.bogged.finance/bsc/swap?tokenIn=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&tokenOut=0x6216B17f696B14701E17BCB24Ec14430261Be94A';
const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
const bshareLPStats = useMemo(() => (bShareFtmLpStats ? bShareFtmLpStats : null), [bShareFtmLpStats]);
const bombPriceInDollars = useMemo(
  () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
  [bombStats],
);
const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);
const bSharePriceInDollars = useMemo(
  () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
  [bShareStats],
);
const bSharePriceInBNB = useMemo(
  () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
  [bShareStats],
);
const bShareCirculatingSupply = useMemo(
  () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
  [bShareStats],
);
const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

const tBondPriceInDollars = useMemo(
  () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
  [tBondStats],
);
const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
const tBondCirculatingSupply = useMemo(
  () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
  [tBondStats],
);
const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

const bombLpZap = useZap({ depositTokenName: 'BOMB-BTCB-LP' });
const bshareLpZap = useZap({ depositTokenName: 'BSHARE-BNB-LP' });

const [onPresentBombZap, onDissmissBombZap] = useModal(
  <ZapModal
    decimals={18}
    onConfirm={(zappingToken, tokenName, amount) => {
      if (Number(amount) <= 0 || isNaN(Number(amount))) return;
      bombLpZap.onZap(zappingToken, tokenName, amount);
      onDissmissBombZap();
    }}
    tokenName={'BOMB-BTCB-LP'}
  />,
);

const [onPresentBshareZap, onDissmissBshareZap] = useModal(
  <ZapModal
    decimals={18}
    onConfirm={(zappingToken, tokenName, amount) => {
      if (Number(amount) <= 0 || isNaN(Number(amount))) return;
      bshareLpZap.onZap(zappingToken, tokenName, amount);
      onDissmissBshareZap();
    }}
    tokenName={'BSHARE-BNB-LP'}
  />,
);

const [modal, setModal] = useState(false);
const [videoLoading, setVideoLoading] = useState(true);

const openModal = () => {
  setModal(!modal);
};

const spinner = () => {
  setVideoLoading(!videoLoading);
};


// Table function 
function createData(name, currentSupply, totalSupply, price) {
  return { name, currentSupply, totalSupply, price };
}

// Table Rows
const rows = [
  createData('BOMB', aveta(round(bombCirculatingSupply, 2), {precision :2}), aveta(round(bombTotalSupply, 2), {precision :2}), roundAndFormatNumber(bombPriceInDollars, 2)),
  createData('BSHARE', aveta(round(bShareCirculatingSupply, 2), {precision :2}), aveta(round(bShareTotalSupply, 2), {precision :2}), roundAndFormatNumber(bSharePriceInDollars, 2)),
  createData('BBOND', aveta(round(tBondCirculatingSupply, 2), {precision :2}), aveta(round(tBondTotalSupply, 2), {precision :2}), roundAndFormatNumber(tBondPriceInDollars, 2)),
];

  return (
    <PageDashboard>
      <BackgroundImage />
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
          <Grid xs={12}>
          <Box sx={{
        backgroundColor: 'rgba(2, 2, 66, 0.55)',border: 15,borderColor: '#387be0',boxShadow: '0 0 10px #387be0',borderRadius : '10',padding: '30px',margin: '20px',}}>
           <Typography variant='h4' style={{textAlign : 'center',  color : 'white'}}>BOMB FINANCE SUMMARY</Typography><hr />
      <div style={{float: 'left', color : 'white'}}>
      <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell> </TableCell>
            <TableCell align="right">Current Suply</TableCell>
            <TableCell align="right">Total Supply</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.currentSupply}</TableCell>
              <TableCell align="right">{row.totalSupply}</TableCell>
              <TableCell align="right">$ {row.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </div>
      <div style ={{textAlign : 'center',float : 'right', padding: '0', color :'white' }}>
              <h3 style={{marginBottom: '10px' , color : 'white'}}>Current Epoch</h3>
              <Typography variant='h3' style={{color : 'white'}}>{Number(currentEpoch)}</Typography><hr />
              <ProgressCountdown  style={{ position: 'relative', fontSize : '30px'}} base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
               Next Epoch in
               <hr />
               <Typography variant='subtitle1' style={{color : 'white'}}>Live TWAP :{scalingFactor}</Typography>
               <Typography variant='subtitle1' style={{color : 'white'}}> TVL : ${aveta(TVL)}</Typography>
      </div>
      <div style ={{clear: 'both'}}></div>
      </Box>
      </Grid>



      <Grid container justifyContent="center" spacing={3} style={{color : 'white'}}>
      <Grid item xs={12} md={8} lg={8} className={classes.gridItem}>
               <div style={{textAlign : 'right', padding : '25px'}}>
               <a className='customLink' href="https://docs.bomb.money/welcome-start-here/strategies"> Read Investment Strategy </a>
               </div>
               <span><Button style={{width: '100%', backgroundColor: 'rgba(13, 153, 255, 0.40)', fontSize: '20px', color : 'white'}} variant="contained">Invest Now</Button></span>
               <Grid container justifyContent="center" spacing={3} style={{color : 'white', marginTop : '10px'}}>
               <Grid item xs={6} md={6} lg={6} className={classes.gridItem}><span><Button style={{width: '100%', 
               backgroundColor: 'rgba(112, 112, 112, 0.40)', 
               fontSize: '20px'}} variant="contained"><a style={{all : 'unset'}} href='https://discord.com/invite/94Aa4wSz3e'><IconDiscord style={{ marginTop: '5px', 
               fill: '#dddfee', 
               height: '30px', width : '30px'}} />Chat on discord </a></Button></span>
               </Grid>
               <Grid item xs={6} md={6} lg={6} className={classes.gridItem}><span><Button style={{width: '100%', 
               backgroundColor: 'rgba(112, 112, 112, 0.40)', 
               fontSize: '20px'}} variant="contained"><a style={{all : 'unset'}} href='https://docs.bomb.money/welcome-start-here/readme'><IconDocs style={{ marginTop: '5px', 
               fill: '#dddfee', 
               height: '30px', width : '30px'}} />Read Docs </a></Button></span>
               </Grid>


               <Grid item xs={12} md={12} lg={12} className={classes.gridItem}> 
               <Box sx={{
         width : '100%',height : '325%', backgroundColor: 'rgba(2, 2, 66, 0.55)',border: 15,borderColor: '#387be0',boxShadow: '0 0 10px #387be0',borderRadius : '10',padding: '10px',marginTop: '20px'}}>
        <Grid container justifyContent="center" spacing={3} style={{color : 'white'}}>
        <Grid item xs={8} className={classes.gridItem}>
              <Grid item xs={12}  className={classes.gridItem}>
              <Grid container justifyContent="center" spacing={3} style={{color : 'white'}}>
              <Grid item xs={2} className={classes.gridItem}>
              <img style={{width: '100%'}} src={IconBshare}></img>
              </Grid>
              <Grid item xs={10} className={classes.gridItem}>
              <Typography variant='h6' style={{width : '100%', color : 'white'}}>Boardroom</Typography>
              <Typography variant='subtitle4  ' style={{width: '100%', color : 'white'}}>Stake BSHARE and earn BOMB every epoch</Typography>
              </Grid>
              </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} className={classes.gridItem}>
                    <Grid container justifyContent="center" spacing={3} style={{color : 'white'}}>
                    <Grid item xs={4} md={4} lg={4} className={classes.gridItem}>
                    <Typography variant='subtitle4' style={{width: '100%', color : 'white'}}>Daily Returns :</Typography>
                    <Typography variant='h6' style={{width: '100%', color : 'white'}}>2%</Typography>
                    </Grid>
                    <Grid item xs={4} md={4} lg={4} className={classes.gridItem}>
                    <Typography variant='subtitle4' style={{width: '100%', color : 'white'}}>Your Stake :</Typography>
                    <Grid container justifyContent="center" spacing={3} style={{color : 'white'}}>
                    <Grid item xs={2} className={classes.gridItem}>
                    <img style ={{width :'500%'}}src={IconBshare}></img>
                    </Grid>
                    <Grid item xs={10} className={classes.gridItem}>
                    <Typography variant='subtitle4' style={{width: '100%', color : 'white'}}> &nbsp;&nbsp; {roundAndFormatNumber(stakedBalance)}</Typography><br></br>
                    <Typography variant='subtitle4' style={{width: '100%', color : 'white'}}> ≈ ${roundAndFormatNumber((stakedBalance * bSharePriceInDollars).toFixed(2), 2)}</Typography>
                    </Grid>
                    </Grid>
                    </Grid>
                    <Grid item xs={4} md={4} lg={4} className={classes.gridItem}>
                    <Typography variant='subtitle4' style={{width: '100%', color : 'white'}}>Earned :</Typography>
                    <Grid container justifyContent="center" spacing={3} style={{color : 'white'}}>
                    <Grid item xs={2} className={classes.gridItem}>
                    <img style ={{width :'400%'}}src={IconBoardroom}></img>
                    </Grid>
                    <Grid item xs={10} className={classes.gridItem}>
                    <Typography variant='subtitle4' style={{width: '100%', color : 'white'}}> &nbsp;&nbsp; {roundAndFormatNumber(stakedBalance)}</Typography><br></br>
                    <Typography variant='subtitle4' style={{width: '100%', color : 'white'}}> ≈ ${roundAndFormatNumber((stakedBalance * bSharePriceInDollars).toFixed(2), 2)}</Typography>
                    </Grid>
                    </Grid>
                    </Grid>
                    </Grid>
                    </Grid>
                    </Grid>
          <Grid item xs={4} className={classes.gridItem}>
          <Grid item xs={12} md={12} lg={12} className={classes.gridItem}>
          <Typography variant='subtitle1' style={{textAlign : 'right', color : 'white', paddingTop : '50px', paddingRight : '50px'}}> TVL : ${aveta(TVL,{digits:7})}</Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} className={classes.gridItem}>
              <Grid container justifyContent="center" spacing={3} style={{color : 'white'}}>
              <Grid item xs={6} md={6} lg={6} className={classes.gridItem}>
              {!!account && (
          <Box mt={2}>
            <Grid container justify="center" spacing={3} mt={10}>
            <Button style ={{width : '100%'}}
                href={buyBombAddress}
                target="_blank"
                className={'shinyButton ' + classes.button}
              >
                Deposit
              </Button>
            </Grid>
          </Box>
        )}
              </Grid>
              <Grid item xs={6} md={6} lg={6} className={classes.gridItem}>
                    {!!account && (
          <Box mt={2} style={{marginRight:'8px'}}>
            <Grid container justify="center" spacing={3} mt={10}>
              <Button style ={{width :'100%'}}

                disabled={stakedBalance.eq(0) || (!canWithdraw)}
                onClick={onRedeem}
                className={
                  stakedBalance.eq(0) || (!canWithdraw)
                    ? 'shinyButtonGrey'
                    : 'shinyButton'
                }
              >
               Withdraw
              </Button>
            </Grid>
          </Box>
        )}
              </Grid>
              <Grid item xs={12} md={12} lg={12} className={classes.gridItem}>
              {!!account && (
          <Box style={{marginRight:'8px'}}>
            <Grid container justify="center" spacing={3}>
              <Button
              style={{width:'100%'}}
                disabled={stakedBalance.eq(0) || ( !canClaimReward)}
                onClick={onRedeem}
                className={
                  stakedBalance.eq(0) || (!canClaimReward)
                    ? 'shinyButtonDisabledSecondary'
                    : 'shinyButtonSecondary'
                }
              >
                Claim
              </Button>
            </Grid>
            </Box>
        )}
              </Grid>
              
              </Grid>
              
                </Grid>
                
              </Grid>
              
              </Grid>
            

      </Box>
      </Grid>
      
               </Grid>
               
              </Grid>
              <Grid item xs={12} md={4} lg={4} className={classes.gridItem}>
              <Box sx={{
                   backgroundColor: 'rgba(2, 2, 66, 0.55)',border: 15,borderColor: '#387be0',boxShadow: '0 0 10px #387be0',borderRadius : '10',padding: '30px',marginLeft : '20px',marginTop: '20px', height: '590%'}}>
                     Latest News
                  </Box>
              </Grid>
              
              </Grid>        
              
    </PageDashboard>

  );
};

export default Dashboard;

/* 
// Claim and Withdraw button
{!!account && (
          <Box mt={5}>
            <Grid container justify="center" spacing={3} mt={10}>
              <Button
                disabled={stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)}
                onClick={onRedeem}
                className={
                  stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)
                    ? 'shinyButtonDisabledSecondary'
                    : 'shinyButtonSecondary'
                }
              >
                Claim &amp; Withdraw
              </Button>
            </Grid>
          </Box>
        )}
      Boilerplate for Glowing Box */


      /* <Grid xs={12}>
      <Box sx={{
        backgroundColor: 'rgba(2, 2, 66, 0.55)',border: 15,borderColor: '#387be0',boxShadow: '0 0 10px #387be0',borderRadius : '10',padding: '30px',marginTop: '20px'}}>
        This is a box nocap
      </Box>
      </Grid> */






 /* <Box mt={5}>
            <Grid container justifyContent="center" spacing={3}>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent style={{textAlign: 'center' }}>
                    <Typography style={{textTransform: 'uppercase', color: '#f9d749' }}>Next Epoch</Typography>
                    <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Current Epoch</Typography>
                    <Typography>{Number(currentEpoch)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>
                      BOMB PEG <small>(TWAP)</small>
                    </Typography>
                    <Typography>{scalingFactor} BTC</Typography>
                    <Typography>
                      <small>per 10,000 BOMB</small>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>APR</Typography>
                    <Typography>{boardroomAPR.toFixed(2)}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
              <Card className={classes.gridItem}>
              <CardContent align="center">
              <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>
                      Total value locked 
                    </Typography>
              {/* <CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" /> */
              /* <Typography> $ {aveta(TVL)}</Typography>
              </CardContent>
              </Card>
              </Grid>
            </Grid>
          </Box>
          <Box mt={5}>
          <Grid container justifyContent="center" spacing={3}> */ 



          /* BOMB */
        /* <Grid item xs={12} sm={2}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BOMB" />
                </CardIcon>
              </Box>
              <Button
                onClick={() => {
                  bombFinance.watchAssetInMetamask('BOMB');
                }}
                style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
              </Button>
              <h2 style={{ marginBottom: '10px' }}>BOMB</h2>
              10,000 BOMB (1.0 Peg) =
              <Box>
                <span style={{ fontSize: '30px', color: 'white' }}>
                  {bombPriceInBNB ? bombPriceInBNB : '-.----'} BTC
                </span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px', alignContent: 'flex-start' }}>
                  ${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'} / BOMB
                </span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${roundAndFormatNumber(bombCirculatingSupply * bombPriceInDollars, 2)} <br />
                Circulating Supply: {aveta(round(bombCirculatingSupply, 2), {precision :2})} <br />
                Total Supply: {aveta(round(bombTotalSupply, 2), {precision :2})}
              </span>
            </CardContent>
          </Card>
        </Grid> */

        /* BSHARE */
        /* <Grid item xs={12} sm={2}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Button
                onClick={() => {
                  bombFinance.watchAssetInMetamask('BSHARE');
                }}
                style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BSHARE" />
                </CardIcon>
              </Box>
              <h2 style={{ marginBottom: '10px' }}>BSHARE</h2>
              Current Price
              <Box>
                <span style={{ fontSize: '30px', color: 'white' }}>
                  {bSharePriceInBNB ? bSharePriceInBNB : '-.----'} BNB
                </span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>
                  ${bSharePriceInDollars ? bSharePriceInDollars : '-.--'} / BSHARE
                </span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${roundAndFormatNumber((bShareCirculatingSupply * bSharePriceInDollars).toFixed(2), 2)}{' '}
                <br />
                Circulating Supply: {aveta(round(bShareCirculatingSupply, 2), {precision :2})} <br />
                Total Supply: {aveta(round(bShareTotalSupply, 2), {precision :2})}
              </span>
            </CardContent>
          </Card>
        </Grid> */

        /* BBOND */
        /* <Grid item xs={12} sm={2}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Button
                onClick={() => {
                  bombFinance.watchAssetInMetamask('BBOND');
                }}
                style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BBOND" />
                </CardIcon>
              </Box>
              <h2 style={{ marginBottom: '10px' }}>BBOND</h2>
              10,000 BBOND
              <Box>
                <span style={{ fontSize: '30px', color: 'white' }}>
                  {tBondPriceInBNB ? tBondPriceInBNB : '-.----'} BTC
                </span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'} / BBOND</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${roundAndFormatNumber((tBondCirculatingSupply * tBondPriceInDollars).toFixed(2), 2)} <br />
                Circulating Supply: {aveta(round(tBondCirculatingSupply, 2), {precision :2})} <br />
                Total Supply: {aveta(round(tBondTotalSupply, 2), {precision :2})}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12}>
          
        </Grid>
        </Grid>
        
        

          </Box> */