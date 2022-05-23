import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';

export default function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link to={'/'}>
          Auth Front
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}