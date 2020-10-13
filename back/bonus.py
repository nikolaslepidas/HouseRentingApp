import numpy as np

class MatrixFactorization():
  def __init__(self, R, K, h):
    """
    We perform matrix factorization with gradient descent to predict empty entries
    in Rating matrix.

    Arguments:
    - R (ndarray) : User-Item rating
    - K (int)     : number of latent features
    - h (float)   : learning rate
    """
    self.R = R
    self.num_users, self.num_items = R.shape
    self.K = K
    self.h = h

  def train(self):
    # Initialize user and latent feature matrix
    self.V = np.random.uniform(size=(self.num_users, self.K))
    # Initialize latent feature and item matrix
    self.F = np.random.uniform(size=(self.K, self.num_items))
    known = np.count_nonzero(self.R)
    rmse_prev = -2
    rmse = -1
    while (rmse != rmse_prev):
      xs, ys = self.R.nonzero()
      total_square_error = 0
      for i, j in zip(xs, ys):
        #compute error_ij
        error_ij = self.R[i,j] - self.V[i,:].dot(self.F[:,j])
        #update V and F arrays
        self.V[i,:] += self.h * 2 * error_ij * self.F[:,j]
        self.F[:,j] += self.h * 2 * error_ij * self.V[i,:]
        total_square_error += pow(error_ij, 2)
      #calculate RMSE
      rmse_prev = rmse
      rmse = np.sqrt(total_square_error / known)
    
  def predicted_matrix(self):
    return self.V.dot(self.F)
