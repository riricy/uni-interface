import { Trans } from '@lingui/macro'
import { sendAnalyticsEvent } from '@uniswap/analytics'
import { InterfaceElementName } from '@uniswap/analytics-events'
import { WalletConnect } from '@web3-react/walletconnect'
import Column, { AutoColumn } from 'components/Column'
import Modal from 'components/Modal'
import { RowBetween } from 'components/Row'
import { ConnectionType, uniwalletConnectConnection } from 'connection'
import { useActivateConnection } from 'connection/activate'
import { UniwalletConnect } from 'connection/WalletConnect'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components/macro'
import { CloseIcon, ThemedText } from 'theme'

import uniPng from '../../assets/images/uniwallet_modal_icon.png'
import { DownloadButton } from './DownloadButton'

const UniwalletConnectWrapper = styled(RowBetween)`
  display: flex;
  flex-direction: column;
  padding: 20px 16px 16px;
`
const HeaderRow = styled(RowBetween)`
  display: flex;
`
const QRCodeWrapper = styled(RowBetween)`
  aspect-ratio: 1;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.white};
  margin: 24px 32px 20px;
  padding: 10px;
`
const Divider = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.backgroundOutline};
  width: 100%;
`

export default function UniwalletModal() {
  const { pendingConnection, error, cancelActivation } = useActivateConnection()
  const [uri, setUri] = useState<string>()

  const isUniwapWallet = pendingConnection?.type === ConnectionType.UNIWALLET
  // Displays the modal if a Uniswap Wallet Connection is pending without error, & qrcode URI is available
  const open = isUniwapWallet && error === undefined && uri !== undefined

  useEffect(() => {
    ;(uniwalletConnectConnection.connector as WalletConnect).events.addListener(
      UniwalletConnect.UNI_URI_AVAILABLE,
      (uri) => {
        uri && setUri(uri)
      }
    )
  }, [])

  useEffect(() => {
    if (open) sendAnalyticsEvent('Uniswap wallet modal opened')
  }, [open])

  const theme = useTheme()
  return (
    <Modal isOpen={open} onDismiss={cancelActivation}>
      <UniwalletConnectWrapper>
        <HeaderRow>
          <ThemedText.SubHeader>
            <Trans>Scan with Uniswap Wallet</Trans>
          </ThemedText.SubHeader>
          <CloseIcon onClick={cancelActivation} />
        </HeaderRow>
        <QRCodeWrapper>
          {uri && (
            <QRCodeSVG
              value={uri}
              width="100%"
              height="100%"
              level="M"
              fgColor={theme.darkMode ? theme.backgroundSurface : theme.black}
              imageSettings={{
                src: uniPng,
                height: 33,
                width: 33,
                excavate: false,
              }}
            />
          )}
        </QRCodeWrapper>
        <Divider />
        <InfoSection />
      </UniwalletConnectWrapper>
    </Modal>
  )
}

const InfoSectionWrapper = styled(RowBetween)`
  display: flex;
  flex-direction: row;
  padding-top: 20px;
  gap: 20px;
`

function InfoSection() {
  return (
    <InfoSectionWrapper>
      <AutoColumn gap="4px">
        <ThemedText.SubHeaderSmall color="textPrimary">
          <Trans>Don&apos;t have Uniswap Wallet?</Trans>
        </ThemedText.SubHeaderSmall>
        <ThemedText.Caption color="textSecondary">
          <Trans>
            Download in the App Store to safely store your tokens and NFTs, swap tokens, and connect to crypto apps.
          </Trans>
        </ThemedText.Caption>
      </AutoColumn>
      <Column>
        <DownloadButton element={InterfaceElementName.UNISWAP_WALLET_MODAL_DOWNLOAD_BUTTON} />
      </Column>
    </InfoSectionWrapper>
  )
}
