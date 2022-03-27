import React from 'react'
import "../styles/Logo.css"
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'
// background: linear-gradient(134deg, rgb(144 87 219) 0%, rgb(98 16 204) 99%);
function Logo() {
    return (
        <motion.div id="logo-page-containers"
            initial={{background: 'linear-gradient(134deg, rgb(108 127 232) 0%, rgb(98 16 204) 99%'}}
            animate={{background: 'linear-gradient(134deg, rgb(98 16 204)  0%, rgb(108 127 232) 99%'}}
            transition={{duration: 0.6}}>
            <div id="logo-container">
                <motion.img id="lungs" src={require("../images/logo.png")}
                    initial={{scale: 1.5, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    transition={{duration: 0.5, delay: 0.6, type: 'tween'}}/>
                <motion.div id="divider" 
                    initial={{opacity: 0}}
                    animate={{opacity: 1}} 
                    transition={{duration: 0.5, delay: 0.6, type: 'tween'}}>
                </motion.div>
                <motion.h1 id="logo_logo" 
                    initial={{marginLeft: '50px', scaleY: 1.5, opacity: 0}} 
                    animate={{marginLeft: '0px', scaleY: 1, opacity: 1}}
                    transition={{duration: 0.5, delay: 0.6, type: 'tween'}}>
                        Connectify
                </motion.h1>
            </div>
        </motion.div>
    )
}

export default Logo