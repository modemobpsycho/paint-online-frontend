import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { ChangeEventHandler, MouseEventHandler } from 'react';
import { Button as BootstrapButton, Modal as BootstrapModal, ModalProps } from 'react-bootstrap';

export default function Modal({
    props,
    isCloseButton,
    onChange,
    onClick
}: {
    isCloseButton: boolean;
    props: ModalProps;
    onChange: ChangeEventHandler<HTMLInputElement>;
    onClick: MouseEventHandler<HTMLButtonElement>;
}) {
    return (
        <Box>
            <BootstrapModal show={props.show} onHide={props.onHide} backdrop="static" keyboard={false} {...props}>
                <BootstrapModal.Header closeButton={isCloseButton}>
                    <BootstrapModal.Title>{props.title}</BootstrapModal.Title>
                </BootstrapModal.Header>
                <BootstrapModal.Body>
                    <InputLabel>{props.message}</InputLabel>
                    <Input type="text" onChange={onChange} />
                </BootstrapModal.Body>
                <BootstrapModal.Footer>
                    <BootstrapButton variant="secondary" disabled={props.value.trim() === ''} onClick={onClick}>
                        Submit
                    </BootstrapButton>
                </BootstrapModal.Footer>
            </BootstrapModal>
        </Box>
    );
}
