import React, { useEffect, useState } from 'react'
import Navegacao from '../../components/Navegacao'
import { Alert, Box, Snackbar, TextField } from '@mui/material'
import FileUpload from 'react-mui-fileuploader'
import { LoadingButton } from '@mui/lab'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'

const Restaurante = () => {
    const [nome, setNome] = useState('')
    const [logo, setLogo] = useState('')
    const [id, setId] = useState('')
    const [loading, setLoading] = useState(false)
    const [sucesso, setSucesso] = useState(false)
    const [error, setError] = useState('')
    const [logoAtual, setLogoAtual] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/restaurantes')
            .then(({ data }) => {
                setNome(data.nome)
                setLogoAtual(process.env.REACT_APP_HOST_API + data.logo)
                setId(data.id)
            })
    }, [])

    const fileChange = (files) => {
        setLogo(files[0])
    }

    const handleSubmit = () => {
        setLoading(true)

        const formData = new FormData()
        formData.append('nome', nome)
        formData.append('logo', logo)

        if (id) {
            api.put('/restaurantes/' + id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(({ data }) => {
                setSucesso(true)
                setTimeout(() => {
                    navigate('/produtos')
                }, 2000)
            }).catch((error) => {
                setError(error.response.data.error)
            }).finally(() => {
                setLoading(false)
            })
        } else {
            api.post('/restaurantes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(({ data }) => {
                setSucesso(true)
                setTimeout(() => {
                    navigate('/produtos')
                }, 2000)
            }).catch((error) => {
                setError(error.response.data.error)
            }).finally(() => {
                setLoading(false)
            })
        }

    }

    return (
        <>
            <Navegacao />
            <Box sx={{ my: 3, mx: 3, width: '50%' }}>
                <Snackbar open={sucesso} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert severity="success" sx={{ width: '100%' }}>
                        Restaurante salvo com sucesso!
                    </Alert>
                </Snackbar>

                <Snackbar open={error.length > 0} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>

                <TextField label="Nome" variant="outlined" fullWidth sx={{ mb: 2 }} onChange={(e) => { setNome(e.target.value) }} value={nome} />
                <FileUpload
                    title="Logo do seu restaurante"
                    header="Arraste para esta área"
                    leftLabel="ou"
                    buttonLabel="Clique aqui"
                    rightLabel="para selecionar"
                    showPlaceholderImage={false}
                    onFilesChange={fileChange}
                />
                {logoAtual && (<img src={logoAtual} />)}
                <LoadingButton
                    color='primary'
                    variant='contained'
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handleSubmit}
                    loading={loading}
                >Salvar</LoadingButton>
            </Box>
        </>

    )
}

export default Restaurante