function python2() {
    $old_PATH=$env:PATH
    $old_PYTHONPATH=$env:PYTHONPATH
    $env:PATH="C:\Users\francisco.nunes\lib\z3-4.8.4.d6df51951f4c-x64-win\bin;C:\Python27;" + $env:PATH
    $env:PYTHONPATH="C:\Users\francisco.nunes\lib\z3-4.8.4.d6df51951f4c-x64-win\bin;C:\Users\francisco.nunes\lib\z3-4.8.4.d6df51951f4c-x64-win\bin\python;C:\Python27\Lib\site-packages"
    try {
        python $args
    } finally {
        $env:PATH=$old_PATH
        $env:PYTHONPATH=$old_PYTHONPATH
    }
}

function python3() {
    $old_PATH=$env:PATH
    $old_PYTHONPATH=$env:PYTHONPATH
    $env:PATH="C:\Users\francisco.nunes\lib\z3-4.8.4.d6df51951f4c-x64-win\bin;C:\Python36;" + $env:PATH
    $env:PYTHONPATH="C:\Users\francisco.nunes\lib\z3-4.8.4.d6df51951f4c-x64-win\bin;C:\Users\francisco.nunes\lib\z3-4.8.4.d6df51951f4c-x64-win\bin\python;C:\Python36\Lib\site-packages"
    try {
        python $args
    } finally {
        $env:PATH=$old_PATH
        $env:PYTHONPATH=$old_PYTHONPATH
    }
}
